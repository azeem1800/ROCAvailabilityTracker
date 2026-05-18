# L1 Staff Availability Tracker

A dark-themed, client-side web application that displays currently available staff members based on their schedules.

## Features

- **Automatic Roster Loading**: Loads staff data automatically without requiring monthly uploads
- **Staff Availability Status**: Shows which staff members are currently available based on their schedules
- **Communication Links**: Includes Teams and Email links for quick communication with staff
- **ROC Team Information**: Displays information and organizational chart for the ROC team
- **Dark Theme**: Features a dark theme with orange accents for better readability

## How to Use

### Viewing Staff Availability

1. Open `index.html` in your web browser
2. The application will automatically load roster data and display currently available staff
3. Click the Teams or Email icons to contact available staff members
4. Use the "Refresh Roster Data" button to reload data if needed

### Adding Your Own Roster Data

To use your own roster data instead of the sample data:

1. Create your roster file as CSV format with the following columns:
   - Name: Staff member's name
   - Bio: Brief description or role
   - Certifications: Any certifications or qualifications
   - Schedule: Availability schedule (e.g., "15/5: 9-17" or "Monday-Friday: 9-17")
   - Team: Team or department name
   - Email: Email address for contact links

2. Save your file as `roster.csv` and place it in the `data` folder

3. Refresh the page in your browser

### Sample Roster Format

A sample roster file is provided in `data/sample-roster.csv` that you can modify or use as a template.

## Schedule Format

The system recognizes several schedule formats:

- **Specific dates**: `15/5: 9-17` (Day/Month: StartHour-EndHour)
- **Weekday ranges**: `Monday-Friday: 9-17`
- **Simple hours**: `9-17` (assumed for current day)

## ROC Team Organizational Chart

1. To display the ROC team organizational chart, save your image as `roc-team.png`
2. Place it in the `img` folder
3. Refresh the page to see it displayed in the ROC Team section

## Notes

- The application runs entirely in the browser with no server required
- Data is cached in the browser's localStorage for persistence
- All files must be accessed through a web server or using the "file://" protocol