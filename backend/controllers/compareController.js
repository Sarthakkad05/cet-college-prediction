import path from 'path';
import { fileURLToPath } from 'url';
import { loadCsv } from '../utils/csvLoader.js';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function compareColleges(req, res) {
  try {
    const { branch, category, percentile, gender } = req.query;

    // Resolve CSV path relative to this controller file
    const csvPath = path.resolve(__dirname, '..', 'data', 'colleges.csv');
    const rows = await loadCsv(csvPath);

    let filtered = rows;

    // Normalize helpers (case-insensitive)
    const toLower = (v) => (v == null ? '' : String(v).toLowerCase().trim());

    if (branch) {
      filtered = filtered.filter((r) =>
        toLower(r.Branch_Name || r.branch || r.Branch) === toLower(branch)
      );
    }

    if (category) {
      filtered = filtered.filter((r) =>
        toLower(r.Caste || r.category || r.Category) === toLower(category)
      );
    }

    if (gender) {
      filtered = filtered.filter((r) => toLower(r.Gender) === toLower(gender));
    }

    if (percentile != null && percentile !== '') {
      const p = Number(percentile);
      filtered = filtered.filter((r) => {
        const rowPercentile = Number(
          r.Percentile ?? r.percentile ?? r.Cutoff ?? r.cutoff
        );
        // Keep if numeric and user's percentile >= row's percentile requirement
        return Number.isFinite(rowPercentile) ? p >= rowPercentile : true;
      });
    }

    return res.json({ count: filtered.length, data: filtered });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load comparison data', error: err.message });
  }
}

