from sqlalchemy.orm import Session

from app.models.department import Department


DEFAULT_DEPARTMENTS = (
    ("Education", "Ministry of Education"),
    ("Healthcare", "Ministry of Health and Family Welfare"),
    ("Agriculture", "Ministry of Agriculture and Farmers Welfare"),
    ("Finance", "Ministry of Finance"),
)


def seed_departments(db: Session) -> None:
    for name, ministry in DEFAULT_DEPARTMENTS:
        department = db.query(Department).filter(Department.name == name).first()
        if department is None:
            db.add(Department(name=name, ministry=ministry))
    db.commit()