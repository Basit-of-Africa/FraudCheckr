"""
Pydantic models for EFCC Convictions Explorer API.
"""

from typing import Optional
from pydantic import BaseModel, Field


class ConvictionRecord(BaseModel):
    """Single conviction record with standardized fields."""
    
    name: str = Field(..., description="Defendant name")
    offense: str = Field(..., description="Offense type")
    prison_term: str = Field(..., description="Prison term in standardized format")
    prison_term_months: Optional[int] = Field(None, description="Prison term in numeric months")
    fine: Optional[str] = Field(None, description="Fine amount")
    restitution: Optional[str] = Field(None, description="Restitution amount")
    court: str = Field(..., description="Court name")

    # Provenance and detail from the canonical dataset (data/convictions.csv)
    record_id: Optional[str] = Field(None, description="Stable FraudCheckr record ID, e.g. FC2024-0848")
    aliases: Optional[str] = Field(None, description="Other names recorded for the defendant, separated by ';'")
    defendant_type: Optional[str] = Field(None, description="individual or organisation")
    co_defendants: Optional[str] = Field(None, description="Other defendants in the same case")
    charge_number: Optional[str] = Field(None, description="Court charge number as recorded by the EFCC")
    offence_category: Optional[str] = Field(None, description="Normalised offence category")
    court_as_recorded: Optional[str] = Field(None, description="Court exactly as written in the source")
    court_type: Optional[str] = Field(None, description="Federal High Court, State High Court, FCT High Court, etc.")
    court_state: Optional[str] = Field(None, description="State (or FCT) where the court sits")
    judge: Optional[str] = Field(None, description="Presiding judge")
    date_filed: Optional[str] = Field(None, description="Date the charge was filed (ISO 8601)")
    date_of_conviction: Optional[str] = Field(None, description="Date of conviction (ISO 8601; YYYY-MM when only the month is known)")
    sentence: Optional[str] = Field(None, description="Sentence text as recorded in the source")
    option_of_fine: Optional[bool] = Field(None, description="Whether the sentence carried an option of fine")
    forfeiture: Optional[bool] = Field(None, description="Whether property was ordered forfeited")
    source_table: Optional[str] = Field(None, description="EFCC table the record comes from")
    source_serial: Optional[str] = Field(None, description="Serial number of the row in that table")
    quality_flags: list[str] = Field(default_factory=list, description="Data-quality notes; see data/DATA_DICTIONARY.md")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "JOHN DOE",
                "offense": "FRAUD",
                "prison_term": "5 YEARS",
                "prison_term_months": 60,
                "fine": "5000000",
                "restitution": "1000000",
                "court": "FEDERAL HIGH COURT"
            }
        }


class PaginatedResponse(BaseModel):
    """Paginated response wrapper."""
    
    total: int = Field(..., description="Total number of records")
    limit: int = Field(..., description="Limit requested")
    offset: int = Field(..., description="Offset used")
    data: list[ConvictionRecord] = Field(..., description="Array of conviction records")


class StatsResponse(BaseModel):
    """Statistics response."""
    
    total_cases: int = Field(..., description="Total number of cases")
    most_common_offense: str = Field(..., description="Most frequently occurring offense")
    average_prison_term_months: Optional[float] = Field(None, description="Average prison term in months")
    unique_courts: int = Field(..., description="Number of unique courts")
    unique_offenses: int = Field(..., description="Number of unique offenses")


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: str = Field(..., description="Service status")
    message: str = Field(..., description="Status message")


class DeveloperSignupRequest(BaseModel):
    email: str = Field(..., description="Developer account email address")
    password: str = Field(..., min_length=8, description="Developer account password")


class DeveloperLoginRequest(BaseModel):
    email: str = Field(..., description="Developer account email address")
    password: str = Field(..., min_length=8, description="Developer account password")


class DeveloperAuthResponse(BaseModel):
    access_token: str = Field(..., description="Developer dashboard session token")
    token_type: str = Field(default="bearer", description="Token type")
    email: str = Field(..., description="Developer account email")


class DeveloperProfileResponse(BaseModel):
    email: str = Field(..., description="Developer account email")
    has_active_subscription: bool = Field(..., description="Whether the developer has an active paid subscription")
    latest_subscription_status: Optional[str] = Field(None, description="Most recent subscription status")
    latest_subscription_reference: Optional[str] = Field(None, description="Most recent Paystack reference")
    latest_subscription_active_until: Optional[str] = Field(None, description="Subscription expiry timestamp")
    latest_subscription_plan: Optional[str] = Field(None, description="Most recent subscription plan name")


class DeveloperPlanDetails(BaseModel):
    name: str = Field(..., description="Plan name")
    price_kobo: int = Field(..., description="Price amount in kobo")
    currency: str = Field(default="NGN", description="Currency code")
    description: str = Field(..., description="Short plan description")
    api_call_quota: int = Field(..., description="Monthly API call quota")
    report_quota: int = Field(..., description="Monthly screening report quota")
    export_enabled: bool = Field(..., description="Whether exports are enabled")
    bulk_screening_enabled: bool = Field(..., description="Whether bulk screening is enabled")
    feature_list: list[str] = Field(default_factory=list, description="List of feature bullets for this plan")
    is_free: bool = Field(False, description="Whether the plan is free")


class DeveloperPlansResponse(BaseModel):
    plans: list[DeveloperPlanDetails] = Field(..., description="Available developer plans")


class DeveloperBillingInitializeRequest(BaseModel):
    plan_name: Optional[str] = Field(None, description="Optional developer plan name override")


class DeveloperBillingInitializeResponse(BaseModel):
    reference: str = Field(..., description="Paystack reference for this checkout")
    authorization_url: str = Field(..., description="Paystack payment URL")
    access_code: Optional[str] = Field(None, description="Paystack access code")
    amount_kobo: int = Field(..., description="Amount in kobo")
    plan_name: str = Field(..., description="Developer plan name")


class DeveloperApiKeySummary(BaseModel):
    key_prefix: str = Field(..., description="Visible API key prefix")
    status: str = Field(..., description="Current API key status")
    created_at: str = Field(..., description="Creation timestamp")
    last_used_at: Optional[str] = Field(None, description="Most recent usage timestamp")


class DeveloperApiKeysResponse(BaseModel):
    has_active_subscription: bool = Field(..., description="Whether the user can use developer APIs")
    keys: list[DeveloperApiKeySummary] = Field(..., description="Issued API keys")


class DeveloperApiKeyIssueResponse(BaseModel):
    api_key: str = Field(..., description="Newly issued API key shown once")
    message: str = Field(..., description="Issuance message")


class ScreeningRequest(BaseModel):
    full_name: str = Field(..., min_length=2, description="Person name to screen")
    aliases: list[str] = Field(default_factory=list, description="Optional aliases for matching")
    location: Optional[str] = Field(None, description="Optional location context")
    reference: Optional[str] = Field(None, description="Caller-provided case or customer reference")
    limit: int = Field(5, ge=1, le=20, description="Maximum matches to return")


class ScreeningMatchRecord(BaseModel):
    match_type: str = Field(..., description="Match classification such as exact or possible")
    confidence: float = Field(..., description="Confidence score between 0 and 1")
    reason: str = Field(..., description="Human-readable explanation for the match")
    record: ConvictionRecord = Field(..., description="Matched conviction record")


class ScreeningSummary(BaseModel):
    exact_matches: int = Field(..., description="Number of exact matches")
    possible_matches: int = Field(..., description="Number of possible matches")
    total_matches: int = Field(..., description="Total matches returned")


class ScreeningQuery(BaseModel):
    full_name: str = Field(..., description="Normalized query name")
    aliases: list[str] = Field(default_factory=list, description="Normalized aliases")
    location: Optional[str] = Field(None, description="Normalized location")
    reference: Optional[str] = Field(None, description="Caller-provided case or customer reference")


class ScreeningAudit(BaseModel):
    created_at: str = Field(..., description="Report creation timestamp")
    dataset_version: str = Field(..., description="Dataset version used during screening")
    source: str = Field(..., description="Data source description")


class ScreeningReportResponse(BaseModel):
    report_id: str = Field(..., description="Saved screening report identifier")
    status: str = Field(..., description="Screening outcome: clear, review, or match")
    confidence: float = Field(..., description="Highest screening confidence")
    summary_text: str = Field(..., description="Human-readable screening outcome")
    query: ScreeningQuery = Field(..., description="Normalized search payload")
    summary: ScreeningSummary = Field(..., description="Result counts")
    matches: list[ScreeningMatchRecord] = Field(..., description="Ordered screening matches")
    audit: ScreeningAudit = Field(..., description="Audit information for the report")


class ScreeningReportListItem(BaseModel):
    report_id: str = Field(..., description="Saved screening report identifier")
    full_name: str = Field(..., description="Original query name")
    status: str = Field(..., description="Screening outcome")
    confidence: float = Field(..., description="Highest screening confidence")
    summary_text: str = Field(..., description="Human-readable screening outcome")
    total_matches: int = Field(..., description="Total matches found")
    created_at: str = Field(..., description="Report creation timestamp")


class ScreeningReportListResponse(BaseModel):
    reports: list[ScreeningReportListItem] = Field(..., description="Recent screening reports")
