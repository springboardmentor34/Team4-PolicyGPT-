from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import require_roles
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


def normalize_user_role(value: str | None) -> str:
    if not value:
        return "Citizen"

    return value.replace("_", " ").title()


def normalize_policy_status(value: str | None) -> str:
    if not value:
        return "Pending"

    return value.replace("_", " ").title()


def safe_count(db: Session, table_name: str) -> int:
    try:
        result = db.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
        count = result.scalar()
        return int(count or 0)

    except Exception as e:
        db.rollback()
        print(f"ERROR counting {table_name}: {e}")
        return 0


@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("administrator")),
):

    # -----------------------------------
    # COUNTS
    # -----------------------------------

    total_users = safe_count(db, "users")
    total_policies = safe_count(db, "policies")
    total_reports = safe_count(db, "reports")
    total_audit_logs = safe_count(db, "audit_logs")

    # -----------------------------------
    # RECENT USERS
    # -----------------------------------

    recent_users = []

    try:
        rows = db.execute(
            text(
                """
                SELECT
                    full_name,
                    role::text AS role,
                    created_at
                FROM users
                ORDER BY created_at DESC
                LIMIT 5
                """
            )
        ).mappings().all()

        recent_users = [
            {
                "name": row["full_name"],
                "role": normalize_user_role(row["role"]),
                "status": "Active",
            }
            for row in rows
        ]

    except Exception as e:
        db.rollback()
        print("ERROR fetching recent users:", e)
        recent_users = []

    # -----------------------------------
    # RECENT POLICIES
    # -----------------------------------

    recent_policies = []

    try:
        rows = db.execute(
            text(
                """
                SELECT
                    title,
                    department,
                    status::text AS status,
                    created_at
                FROM policies
                ORDER BY created_at DESC
                LIMIT 5
                """
            )
        ).mappings().all()

        recent_policies = [
            {
                "title": row["title"],
                "department": row["department"] or "General",
                "status": normalize_policy_status(row["status"]),
            }
            for row in rows
        ]

    except Exception as e:
        db.rollback()
        print("ERROR fetching recent policies:", e)
        recent_policies = []

    # -----------------------------------
    # RECENT REPORTS
    # -----------------------------------

    recent_reports = []

    try:
        rows = db.execute(
            text(
                """
                SELECT
                    r.report_type,
                    r.format,
                    r.created_at,
                    u.full_name AS generated_by
                FROM reports r
                LEFT JOIN users u
                    ON u.user_id = r.generated_by
                ORDER BY r.created_at DESC
                LIMIT 5
                """
            )
        ).mappings().all()

        recent_reports = [
            {
                "report": f"{row['report_type']} Report",
                "date": (
                    row["created_at"].strftime("%d %b %Y")
                    if row["created_at"]
                    else "N/A"
                ),
            }
            for row in rows
        ]

    except Exception as e:
        db.rollback()
        print("ERROR fetching recent reports:", e)
        recent_reports = []

    # -----------------------------------
    # RECENT ACTIVITY
    # -----------------------------------

    recent_activity = []

    try:
        rows = db.execute(
            text(
                """
                SELECT
                    u.full_name AS user_name,
                    a.action,
                    a.created_at
                FROM audit_logs a
                LEFT JOIN users u
                    ON u.user_id = a.user_id
                ORDER BY a.created_at DESC
                LIMIT 5
                """
            )
        ).mappings().all()

        recent_activity = [
            {
                "user": row["user_name"] or "System",
                "action": row["action"],
                "time": (
                    row["created_at"].strftime("%I:%M %p")
                    if row["created_at"]
                    else "N/A"
                ),
                "type": (
                    "admin"
                    if "admin" in (row["user_name"] or "").lower()
                    else "official"
                ),
            }
            for row in rows
        ]

    except Exception as e:
        db.rollback()
        print("ERROR fetching audit logs:", e)
        recent_activity = []

    # -----------------------------------
    # ANALYTICS
    # -----------------------------------

    analytics = [
        {
            "category": "Registered Users",
            "value": total_users,
            "icon": "person_add",
        },
        {
            "category": "Policies in Repository",
            "value": total_policies,
            "icon": "description",
        },
        {
            "category": "Audit Events",
            "value": total_audit_logs,
            "icon": "security",
        },
    ]

    # -----------------------------------
    # RESPONSE
    # -----------------------------------

    return {
        "adminName": "System Administrator",

        "totalUsers": total_users,
        "totalPolicies": total_policies,
        "totalReports": total_reports,
        "auditLogs": total_audit_logs,

        "userGrowth": "+0.0%",
        "policyGrowth": "+0.0%",

        "reportStatus": (
            f"{total_reports} reports"
            if total_reports
            else "No reports"
        ),

        "auditStatus": (
            f"{total_audit_logs} recent"
            if total_audit_logs
            else "No activity"
        ),

        "users": recent_users or [
            {
                "name": "No users in database",
                "role": "Citizen",
                "status": "Inactive",
            }
        ],

        "policies": recent_policies or [
            {
                "title": "No policy records yet",
                "department": "General",
                "status": "Pending",
            }
        ],

        "analytics": analytics,

        "reports": recent_reports or [
            {
                "report": "No reports generated",
                "date": "N/A",
            }
        ],

        "auditLogList": recent_activity or [
            {
                "user": "System",
                "action": "No audit events yet",
                "time": "N/A",
                "type": "admin",
            }
        ],
    }