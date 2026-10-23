# Data Schema

Complete documentation of the data structure used in EFCC Convictions Explorer.

## Conviction Record Structure

### ConvictionRecord (JSON)

```json
{
  "name": "JOHN DOE",
  "offense": "CYBER CRIME",
  "prison_term": "5 YEARS",
  "prison_term_months": 60,
  "fine": "5000000",
  "restitution": "1000000",
  "court": "FEDERAL HIGH COURT"
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | string | Defendant name (uppercase) | "JOHN DOE" |
| `offense` | string | Type of offense charged | "CYBER CRIME" |
| `prison_term` | string | Prison sentence (standardized) | "5 YEARS" |
| `prison_term_months` | integer\|null | Prison term in numeric months | 60 |
| `fine` | string\|null | Fine amount (numeric string) | "5000000" |
| `restitution` | string\|null | Restitution amount | "1000000" |
| `court` | string | Court where conviction occurred | "FEDERAL HIGH COURT" |

## Data Types

### String Fields
- **name**: 1-255 characters, uppercase
- **offense**: 1-255 characters, uppercase
- **court**: 1-255 characters, uppercase
- **prison_term**: Formatted string (e.g., "5 YEARS", "3 MONTHS")
- **fine**: Numeric string, no currency symbols (₦ removed)
- **restitution**: Numeric string, no currency symbols

### Numeric Fields
- **prison_term_months**: Integer representing months
  - Null for life sentences or unspecified terms
  - Range: 0-1200+ months

### Null/Optional Fields
- `fine` - Can be null if no fine imposed
- `restitution` - Can be null if no restitution ordered
- `prison_term_months` - Can be null for "LIFE" sentences

## Data Validation Rules

### Before Processing
Raw CSV data from EFCC official records

### After Processing
All data is processed by `scripts/build_dataset.py` (see `data/README.md` for the full method):

1. **Text Normalization**
   - All text converted to UPPERCASE
   - Leading/trailing whitespace removed
   - 🕌 Special currency symbols (₦) removed

2. **Name Processing**
   - "& ANOR" (and another) splits into separate records
   - "AND ANOR(S)" patterns removed
   - Multiple defendants separated

3. **Prison Term Parsing**
   - "5 YEARS" → prison_term = "5 YEARS", prison_term_months = 60
   - "24 MONTHS" → prison_term = "24 MONTHS", prison_term_months = 24
   - "LIFE" → prison_term = "LIFE", prison_term_months = null
   - "NOT SPECIFIED" → prison_term = "NOT SPECIFIED", prison_term_months = null

4. **Monetary Values**
   - Currency symbols removed
   - Commas removed
   - Leading/trailing spaces trimmed
   - Non-numeric characters removed
   - Stored as string representation of integer value

5. **Deduplication**
   - Exact duplicates removed
   - Key: (name, offense, court)
   - Keeps first occurrence

## CSV File Format

### Input CSV Columns Required
```
name,offense,prison_term,fine,restitution,court
```

### Example Input
```csv
name,offense,prison_term,fine,restitution,court
John Doe & ANOR,Fraud,5 YEARS,₦5,000,000,₦1,000,000,Federal High Court
Jane Smith,Money Laundering,10 YEARS,₦10,000,000,,Supreme Court
```

### Output (After Processing)
```csv
name,offense,prison_term,prison_term_months,fine,restitution,court
JOHN DOE,FRAUD,5 YEARS,60,5000000,1000000,FEDERAL HIGH COURT
JANE SMITH,MONEY LAUNDERING,10 YEARS,120,10000000,,SUPREME COURT
```

## Aggregated Data (Statistics)

### StatsResponse

```json
{
  "total_cases": 7876,
  "most_common_offense": "CYBERCRIME",
  "average_prison_term_months": 45.2,
  "unique_courts": 33,
  "unique_offenses": 50
}
```

## Dataset Statistics

### By the Numbers
The authoritative field list, methodology and quality flags are in [`data/README.md`](../../data/README.md);
current counts are in [`data/QUALITY_REPORT.md`](../../data/QUALITY_REPORT.md).

- **Source**: EFCC *Narrative of Convictions* tables, 2020–2024
- **Courts**: Federal, State and FCT High Courts

### Data Updates
- Rebuilt by `scripts/build_dataset.py` from `data/source/`
- Multiple defendants are split into separate records, with co-defendants listed

## Data Quality

### Cleaning Operations Performed

✅ All text converted to uppercase  
✅ Multiple defendants split into separate records  
✅ Currency symbols removed from amounts  
✅ Prison terms standardized to numeric value  
✅ Missing values handled safely  
✅ Duplicate records removed  
✅ Inconsistent spacing normalized  

### Known Limitations

- Some prison terms ambiguous or unspecified
- Some fine amounts include multiple conditions
- Court names may have abbreviated forms
- Offense names have multiple variants

## Database Schema (Conceptual)

If migrating to SQL database:

```sql
CREATE TABLE convictions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  offense VARCHAR(255) NOT NULL,
  prison_term VARCHAR(100),
  prison_term_months INT NULL,
  fine BIGINT NULL,
  restitution BIGINT NULL,
  court VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(name, offense, court)
);

CREATE INDEX idx_name ON convictions(name);
CREATE INDEX idx_offense ON convictions(offense);
CREATE INDEX idx_court ON convictions(court);
CREATE INDEX idx_prison_term_months ON convictions(prison_term_months);
```

---

**Documentation Version**: 1.0.0  
**Last Updated**: March 30, 2026
