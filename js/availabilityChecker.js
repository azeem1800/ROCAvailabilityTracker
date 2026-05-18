/**
 * availabilityChecker.js
 * Checks which staff members are currently available based on their schedule
 */

class AvailabilityChecker {
    constructor() {
        this.availableStaffListElement = document.getElementById('available-staff-list');
        this.currentDateTimeElement = document.getElementById('current-date-time');
        
        // Set up event listeners
        document.addEventListener('rosterUpdated', (event) => {
            console.log('AvailabilityChecker received rosterUpdated event', event.detail);
            this.checkAvailability(event.detail.rosterData);
        });
        
        // Update the current time display immediately and every minute
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 60000);
        
        // Check availability every minute to keep the list updated
        setInterval(() => this.refreshAvailability(), 60000);
        
        // Initial check for roster data on page load
        setTimeout(() => {
            this.initialAvailabilityCheck();
        }, 800); // Wait a bit to ensure fileProcessor has had time to load data
    }
    
    /**
     * Initial check for availability on page load
     */
    initialAvailabilityCheck() {
        console.log('Performing initial availability check');
        const rosterData = fileProcessor.getRosterData();
        if (rosterData) {
            console.log('Found roster data during initial check:', rosterData.length + ' records');
            this.checkAvailability(rosterData);
        } else {
            console.log('No roster data found during initial check');
            
            // Try to get data from localStorage directly as a fallback
            try {
                const savedData = localStorage.getItem('rosterData');
                if (savedData) {
                    console.log('Found roster data in localStorage during fallback check');
                    const parsedData = JSON.parse(savedData);
                    this.checkAvailability(parsedData);
                }
            } catch (error) {
                console.error('Error during fallback localStorage check:', error);
            }
        }
    }
    
    /**
     * Update the current time display
     */
    updateCurrentTime() {
        const now = new Date();
        this.currentDateTimeElement.textContent = now.toLocaleString();
    }
    
    /**
     * Refresh the availability status based on current time
     */
    refreshAvailability() {
        this.updateCurrentTime();
        const rosterData = fileProcessor.getRosterData();
        if (rosterData) {
            this.checkAvailability(rosterData);
        }
    }
    
    /**
     * Check which staff members are available now
     */
    checkAvailability(rosterData) {
        if (!rosterData || !Array.isArray(rosterData) || rosterData.length === 0) {
            this.displayNoStaffMessage();
            return;
        }
        
        // Get current date and time
        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
        const currentHour = now.getHours();
        
        // Find staff members who are available now
        const availableStaff = rosterData.filter(staff => {
            return this.isStaffAvailable(staff, currentDay, currentMonth, currentHour, now);
        });
        
        // Display available staff
        this.displayAvailableStaff(availableStaff);
    }
    
    /**
     * Check if a staff member is available at the current time
     */
    isStaffAvailable(staff, currentDay, currentMonth, currentHour, now) {
        // Get schedule field (trying different possible field names)
        const scheduleField = this.findField(staff, ['Schedule', 'Shifts', 'Hours']);
        if (!scheduleField) return false;
        
        const schedule = staff[scheduleField];
        if (!schedule) return false;
        
        // Parse the schedule (this is a simplified example)
        // In a real application, you would need more robust parsing based on your actual data format
        
        try {
            // Try to parse common schedule formats
            
            // Format 1: "Day/Month: StartHour-EndHour" (e.g., "15/4: 9-17")
            const dayShiftRegex = /(\d+)\/(\d+):\s*(\d+)-(\d+)/;
            const match = schedule.match(dayShiftRegex);
            
            if (match) {
                const day = parseInt(match[1]);
                const month = parseInt(match[2]);
                const startHour = parseInt(match[3]);
                const endHour = parseInt(match[4]);
                
                return (
                    currentDay === day && 
                    currentMonth === month && 
                    currentHour >= startHour && 
                    currentHour < endHour
                );
            }
            
            // Format 2: "Monday-Friday: 9-17" or similar text-based formats
            const weekdayRegex = /([A-Za-z]+)-([A-Za-z]+):\s*(\d+)-(\d+)/;
            const weekdayMatch = schedule.match(weekdayRegex);
            
            if (weekdayMatch) {
                const startDay = weekdayMatch[1].toLowerCase();
                const endDay = weekdayMatch[2].toLowerCase();
                const startHour = parseInt(weekdayMatch[3]);
                const endHour = parseInt(weekdayMatch[4]);
                
                // Get day of week (0 = Sunday, 1 = Monday, etc.)
                const dayOfWeek = now.getDay();
                
                // Map day names to numbers
                const dayMap = {
                    'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
                    'thursday': 4, 'friday': 5, 'saturday': 6
                };
                
                const startDayNum = dayMap[startDay];
                const endDayNum = dayMap[endDay];
                
                // Check if current day is within the range
                let isDayInRange = false;
                if (startDayNum <= endDayNum) {
                    // Normal range (e.g., Monday-Friday)
                    isDayInRange = dayOfWeek >= startDayNum && dayOfWeek <= endDayNum;
                } else {
                    // Wrapping range (e.g., Friday-Monday)
                    isDayInRange = dayOfWeek >= startDayNum || dayOfWeek <= endDayNum;
                }
                
                return isDayInRange && currentHour >= startHour && currentHour < endHour;
            }
            
            // Format 3: Simple "9-17" (assuming it's for the current day)
            const hoursOnlyRegex = /(\d+)-(\d+)/;
            const hoursMatch = schedule.match(hoursOnlyRegex);
            
            if (hoursMatch) {
                const startHour = parseInt(hoursMatch[1]);
                const endHour = parseInt(hoursMatch[2]);
                
                return currentHour >= startHour && currentHour < endHour;
            }
        } catch (error) {
            console.error('Error parsing schedule:', error);
            return false;
        }
        
        // If no pattern matches, assume not available
        return false;
    }
    
    /**
     * Find a field in the staff object by trying different possible field names
     */
    findField(obj, possibleNames) {
        for (const name of possibleNames) {
            // Check for exact match
            if (obj[name] !== undefined) {
                return name;
            }
            
            // Check for case-insensitive match
            const key = Object.keys(obj).find(k => k.toLowerCase() === name.toLowerCase());
            if (key) {
                return key;
            }
        }
        
        return null;
    }
    
    /**
     * Display available staff members
     */
    displayAvailableStaff(availableStaff) {
        // Clear previous content
        this.availableStaffListElement.innerHTML = '';
        
        if (availableStaff.length === 0) {
            this.displayNoStaffMessage();
            return;
        }
        
        // Create and append staff cards
        availableStaff.forEach(staff => {
            const staffCard = document.createElement('div');
            staffCard.className = 'staff-card';
            
            const nameField = this.findField(staff, ['Name', 'StaffName', 'Employee']);
            const bioField = this.findField(staff, ['Bio', 'Biography', 'Skills', 'Information']);
            const certField = this.findField(staff, ['Certifications', 'Certs', 'Certificates']);
            const scheduleField = this.findField(staff, ['Schedule', 'Shifts', 'Hours']);
            const teamField = this.findField(staff, ['Team', 'Department', 'Group', 'Unit']);
            const emailField = this.findField(staff, ['Email', 'EmailAddress', 'Contact', 'Mail']);
            
            // Get values (with fallbacks)
            const name = nameField ? staff[nameField] : 'Unknown';
            const bio = bioField ? staff[bioField] : 'No bio information available';
            const certs = certField ? staff[certField] : 'No certification information available';
            const schedule = scheduleField ? staff[scheduleField] : 'No schedule information available';
            const team = teamField ? staff[teamField] : 'No team information available';
            const email = emailField ? staff[emailField] : '';
            
            // Create card content with Teams and Outlook icons
            const teamsUsername = email ? email.split('@')[0] : '';
            const teamsLink = teamsUsername ? `https://teams.microsoft.com/l/chat/0/0?users=${email}` : '';
            const emailLink = email ? `mailto:${email}` : '';
            
            staffCard.innerHTML = `
                <div class="staff-name">${name}</div>
                <div class="staff-team"><strong>Team:</strong> ${team}</div>
                <div class="staff-bio"><strong>Bio/Skills:</strong> ${bio}</div>
                <div class="staff-certs"><strong>Certifications:</strong> ${certs}</div>
                <div class="staff-hours"><strong>Schedule:</strong> ${schedule}</div>
                <div class="contact-icons">
                    ${teamsLink ? `<a href="${teamsLink}" class="icon-link" target="_blank" title="Chat on Teams"><span class="icon teams-icon"></span>Teams</a>` : ''}
                    ${emailLink ? `<a href="${emailLink}" class="icon-link" title="Send Email"><span class="icon email-icon"></span>Email</a>` : ''}
                </div>
            `;
            
            this.availableStaffListElement.appendChild(staffCard);
        });
    }
    
    /**
     * Display a message when no staff members are available
     */
    displayNoStaffMessage() {
        this.availableStaffListElement.innerHTML = `
            <div class="no-staff-message">No staff members are currently available.</div>
        `;
    }
}

// Create a global availabilityChecker instance
const availabilityChecker = new AvailabilityChecker();