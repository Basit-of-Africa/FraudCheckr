# Frequently Asked Questions

Common questions about EFCC Convictions Explorer.

## General Questions

### What is EFCC Convictions Explorer?

EFCC Convictions Explorer is a web application for searching and analyzing Nigerian EFCC conviction records. It provides a REST API and modern React dashboard to explore 7,788+ conviction records from 2020-2024.

### How much does it cost?

The platform is completely **free and open source**.

### Can I use this commercially?

See the Terms of Service on the website. No open-source licence has been published for this repository yet.

### Is the data verified?

All records come from the EFCC's published *Narrative of Convictions* tables (2020–2024). Extraction errors are corrected and anything uncertain is flagged, but records have not been checked against court files. See `data/README.md`.

### What's included in the platform?

- Backend REST API (FastAPI)
- Frontend dashboard (React)
- EFCC conviction records, 2020–2024 tables
- Statistical analytics
- Full documentation

## Technical Questions

### What are the system requirements?

**Minimum:**
- Python 3.10+
- Node.js 16+
- 500MB free disk space
- 4GB RAM

**Recommended:**
- Python 3.11+
- Node.js 18+
- 1GB free disk space
- 8GB RAM

### How long does installation take?

Typically 5-10 minutes:
- Backend setup: 2-3 minutes
- Frontend setup: 3-7 minutes

### Can I deploy this to production?

Yes! Deployment guide available in [Deployment](./guides/deployment.md) section.

### Does it work on Windows/Mac/Linux?

Yes, all platforms are supported.

### What ports does it use?

- **Backend**: 8000 (configurable)
- **Frontend**: 3000 (configurable)

### How much memory does it use?

Approximately:
- Backend: 50-100MB
- Frontend: 30-50MB
- Total: ~150MB

## Data Questions

### How many records are in the database?

See `data/QUALITY_REPORT.md` for the current count (one record per defendant, from the EFCC's 2020–2024 tables).

Some cases involve multiple defendants, which are split into separate records for analysis.

### What years does the data cover?

The dataset covers the EFCC's tables for **2020–2024**. New tables can be added to `data/source/` and the dataset rebuilt with `python scripts/build_dataset.py`.

### Can I import my own data?

Yes! Follow the [Data Import Guide](./guides/importing-data.md).

**Required CSV columns:**
```
name, offense, prison_term, fine, restitution, court
```

### How is the data cleaned?

Data goes through:
- Text normalization (uppercase)
- Multiple defendant splitting
- Currency symbol removal
- Prison term standardization
- Deduplication

See [Data Schema](./architecture/data-schema.md) for details.

### Can I download all the data?

Yes, download the `data/convictions.csv` file from the project repository.

### Is personal data protected?

The platform shows public EFCC conviction records only. No private data is stored.

## API Questions

### Do I need authentication?

No, the API is public and doesn't require authentication.

### What's the rate limit?

Currently, there's **no rate limit**. In production, 100 requests/minute is recommended.

### Can I use the API from my app?

Yes! The API is RESTful and well-documented.

**Example:**
```bash
curl http://localhost:8000/convictions
```

### Does the API support CORS?

Not by default, but can be enabled in `main.py`.

### Can I get API response in XML?

No, only JSON is supported currently.

## Frontend Questions

### Is it mobile-friendly?

Yes, the dashboard is fully responsive on all devices.

### Does it work in all browsers?

Supported:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (latest)

### Can I customize the colors?

Yes, edit `tailwind.config.js` and `src/index.css`.

### Is the frontend accessible?

Yes, follows WCAG guidelines for accessibility.

### Can I add more filters?

Yes, modify `Dashboard.jsx` component to add custom filters.

## Deployment Questions

### How do I deploy to production?

See the [Deployment Guide](./guides/deployment.md).

**Quick summary:**
1. Setup server (AWS, Heroku, DigitalOcean, etc.)
2. Install dependencies
3. Configure environment variables
4. Run with gunicorn (backend) & nginx (frontend)
5. Setup SSL certificate

### Can I use Docker?

Yes! Docker setup is available in [Docker Guide](./guides/docker.md).

### What's the estimated hosting cost?

For small-to-medium usage:
- AWS: ~$10/month
- Heroku: ~$7/month
- DigitalOcean: ~$5/month

(Prices vary based on traffic and storage)

### How do I setup a domain?

Purchase domain from registrar (GoDaddy, Namecheap, etc.) and point DNS to your server.

## Contributing Questions

### How can I contribute?

See [Contributing Guidelines](./contributing/guidelines.md).

**Ways to contribute:**
- Report bugs
- Suggest features
- Write documentation
- Submit code fixes
- Add data

### Where do I report bugs?

Create an issue on [GitHub Issues](https://github.com/yourusername/efcc-convictions-explorer/issues).

### Can I contribute new features?

Yes! Follow the [Pull Request Guidelines](./contributing/pull-requests.md).

### What's the code style?

Python: PEP 8  
JavaScript: Prettier + ESLint

See [Code Style Guide](./contributing/code-style.md).

## Troubleshooting

### API won't start

Check the [Troubleshooting Guide](./troubleshooting.md) for:
- Port already in use
- Missing modules
- Data file issues

### Frontend shows blank page

**Checklist:**
1. Backend running on port 8000?
2. Network tab shows successful API calls?
3. Console shows JavaScript errors?

### Getting 404 errors

Ensure:
1. CSV file exists in project root
2. File has correct headers
3. Data is properly formatted

## More Questions?

- 📖 Check [Full Documentation](../README.md)
- 🐛 Report [Issues on GitHub](https://github.com/yourusername/efcc-convictions-explorer/issues)
- 💬 Start a [GitHub Discussion](https://github.com/yourusername/efcc-convictions-explorer/discussions)

---

**Documentation Version**: 1.0.0  
**Last Updated**: March 30, 2026
