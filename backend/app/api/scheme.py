from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.scheme import (
    count_schemes,
    create_scheme,
    delete_scheme,
    get_scheme,
    get_schemes,
    search_schemes,
    update_scheme,
    update_scheme_status,
)
from app.db.database import get_db
from app.models.scheme import SchemeStatus
from app.schemas.scheme import (
    SchemeCreate,
    SchemeList,
    SchemeResponse,
    SchemeSearchFilters,
    SchemeStatusUpdate,
    SchemeUpdate,
)


router = APIRouter(
    prefix="/schemes",
    tags=["Schemes"],
)


# ============================================================
# CREATE SCHEME
# ============================================================

@router.post(
    "/",
    response_model=SchemeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_scheme(
    scheme_data: SchemeCreate,
    db: Session = Depends(get_db),
    created_by: Optional[UUID] = None,
) -> SchemeResponse:
    """Create a new scheme record with draft status."""

    return create_scheme(
        db=db,
        scheme_data=scheme_data,
        created_by=created_by,
    )


# ============================================================
# LIST SCHEMES
# ============================================================

@router.get(
    "/",
    response_model=SchemeList,
)
def list_schemes(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    status_filter: Optional[SchemeStatus] = Query(
        default=None,
        alias="status",
    ),
) -> SchemeList:
    """Get a paginated list of schemes, optionally filtered by status."""

    items = get_schemes(
        db=db,
        skip=skip,
        limit=limit,
        status=status_filter,
    )

    total = count_schemes(db=db)

    return SchemeList(
        items=items,
        total=total,
        skip=skip,
        limit=limit,
    )


# ============================================================
# SEARCH SCHEMES
# IMPORTANT: This MUST come before /{scheme_id}
# ============================================================

@router.get(
    "/search",
    response_model=SchemeList,
)
def search_scheme_records(
    keyword: Optional[str] = Query(default=None),
    department: Optional[str] = Query(default=None),
    state: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    status_filter: Optional[SchemeStatus] = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
) -> SchemeList:
    """Search schemes using keyword and attribute filters."""

    filters = SchemeSearchFilters(
        keyword=keyword,
        department=department,
        state=state,
        category=category,
        status=status_filter,
    )

    items = search_schemes(
        db=db,
        filters=filters,
        skip=skip,
        limit=limit,
    )

    return SchemeList(
        items=items,
        total=len(items),
        skip=skip,
        limit=limit,
    )


# ============================================================
# GET SCHEME BY ID
# ============================================================

@router.get(
    "/{scheme_id}",
    response_model=SchemeResponse,
)
def get_scheme_by_id(
    scheme_id: UUID,
    db: Session = Depends(get_db),
) -> SchemeResponse:
    """Fetch a single scheme by its UUID."""

    scheme = get_scheme(
        db=db,
        scheme_id=scheme_id,
    )

    if scheme is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with id {scheme_id} not found.",
        )

    return scheme


# ============================================================
# UPDATE SCHEME
# ============================================================

@router.put(
    "/{scheme_id}",
    response_model=SchemeResponse,
)
def update_existing_scheme(
    scheme_id: UUID,
    scheme_data: SchemeUpdate,
    db: Session = Depends(get_db),
) -> SchemeResponse:
    """Update editable fields of an existing scheme."""

    scheme = get_scheme(
        db=db,
        scheme_id=scheme_id,
    )

    if scheme is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with id {scheme_id} not found.",
        )

    return update_scheme(
        db=db,
        scheme=scheme,
        scheme_data=scheme_data,
    )


# ============================================================
# DELETE SCHEME
# ============================================================

@router.delete(
    "/{scheme_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_scheme(
    scheme_id: UUID,
    db: Session = Depends(get_db),
) -> None:
    """Hard-delete a scheme record."""

    scheme = get_scheme(
        db=db,
        scheme_id=scheme_id,
    )

    if scheme is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with id {scheme_id} not found.",
        )

    delete_scheme(
        db=db,
        scheme=scheme,
    )


# ============================================================
# UPDATE SCHEME STATUS
# ============================================================

@router.patch(
    "/{scheme_id}/status",
    response_model=SchemeResponse,
)
def update_scheme_lifecycle_status(
    scheme_id: UUID,
    status_data: SchemeStatusUpdate,
    db: Session = Depends(get_db),
) -> SchemeResponse:
    """Update the lifecycle status of a scheme."""

    scheme = get_scheme(
        db=db,
        scheme_id=scheme_id,
    )

    if scheme is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scheme with id {scheme_id} not found.",
        )

    return update_scheme_status(
        db=db,
        scheme=scheme,
        new_status=status_data.status,
    )