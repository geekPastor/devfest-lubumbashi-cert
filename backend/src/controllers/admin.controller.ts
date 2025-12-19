import { Request, Response } from 'express';
import { parse } from 'csv-parse/sync';
import { Volunteer } from '../models/volunteer';

interface VolunteerCSVRow {
  name: string;
  email: string;
  role?: string;
  type?: string; // 'volunteer' or 'speaker'
}

export const uploadVolunteers = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Parse CSV file
    const fileContent = req.file.buffer.toString('utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as VolunteerCSVRow[];

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'CSV file is empty'
      });
    }

    // Validate required fields
    const invalidRows: number[] = [];
    records.forEach((row, index) => {
      if (!row.name || !row.email) {
        invalidRows.push(index + 2); // +2 because: +1 for 0-index, +1 for header row
      }
    });

    if (invalidRows.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid data in rows: ${invalidRows.join(', ')}. Name and email are required.`
      });
    }

    // Check for duplicates in the CSV
    const emails = records.map(r => r.email.toLowerCase());
    const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);

    if (duplicates.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Duplicate emails found in CSV: ${[...new Set(duplicates)].join(', ')}`
      });
    }

    // Process uploads
    const results = {
      total: records.length,
      created: 0,
      updated: 0,
      errors: [] as { row: number; email: string; error: string }[]
    };

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      try {
        // Check if volunteer already exists
        const existing = await Volunteer.findOne({ email: row.email });

        if (existing) {
          // Update existing volunteer
          if (existing.id) {
            const volunteerType = (row.type === 'speaker' || row.type === 'volunteer') ? row.type : 'volunteer';
            await Volunteer.findByIdAndUpdate(existing.id, {
              name: row.name,
              role: row.role || 'Volunteer',
              type: volunteerType as 'volunteer' | 'speaker'
            });
            results.updated++;
          }
        } else {
          // Create new volunteer
          const volunteerType = (row.type === 'speaker' || row.type === 'volunteer') ? row.type : 'volunteer';
          await Volunteer.create({
            name: row.name,
            email: row.email,
            role: row.role || 'Volunteer',
            type: volunteerType as 'volunteer' | 'speaker',
            verified: false
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors.push({
          row: i + 2,
          email: row.email,
          error: error.message || 'Unknown error'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Upload completed. Created: ${results.created}, Updated: ${results.updated}`,
      data: results
    });

  } catch (error: any) {
    console.error('Error uploading volunteers:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing file: ' + error.message
    });
  }
};


export const getVolunteersStats = async (req: Request, res: Response) => {
  try {
    const volunteers = await Volunteer.findAll();

    const total = volunteers.length;

    const volunteersCount = volunteers.filter(
      (v: any) => v.type === "volunteer" || !v.type
    ).length;

    const speakersCount = volunteers.filter((v: any) => v.type === "speaker").length;

    const certifiedCount = volunteers.filter((v: any) => {
      // selon ton modèle, certificateId peut être string / null / undefined
      return typeof v.certificateId === "string" && v.certificateId.trim().length > 0;
    }).length;

    const pendingCount = total - certifiedCount;

    return res.status(200).json({
      success: true,
      data: {
        total,
        volunteers: volunteersCount,
        speakers: speakersCount,
        certified: certifiedCount,
        pending: pendingCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return res.status(500).json({
      success: false,
      error: "Error fetching statistics",
      details: error?.message,
    });
  }
};

