/**
 * app.js
 * Main application file that initializes and coordinates the application
 * This version has been modified to directly incorporate roster data
 */

class App {
    constructor() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }
    
    /**
     * Initialize the application
     */
    initialize() {
        console.log('ROC Staff Availability Tracker initialized');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load the hardcoded roster data
        this.loadHardcodedRoster();
        
        // Add refresh button
        this.addRefreshDataButton();
    }
    
    /**
     * Load roster data directly from hardcoded values
     * This bypasses all browser security restrictions
     */
    loadHardcodedRoster() {
        // Get file info div for status updates
        const fileInfoDiv = document.getElementById('file-info');
        fileInfoDiv.innerHTML = `<div class="message info-message">Loading roster data...</div>`;
        
        // Create the hardcoded roster data from data/roster.csv
        const rosterData = [
            {
                "Name": "Komal Muruskar",
                "Bio": "ROC expert with 3+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Wednesday-Sunday: 03-11",
                "Team": "Support Team",
                "Email": "KM00848642@TechMahindra.com"
            },
			{
                "Name": "Ganesh Barkade",
                "Bio": "ROC expert with 10+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Monday-Friday: 09-18",
                "Team": "Support Team",
                "Email": "GaneshNana.Barkade@TechMahindra.com"
            },
            {
                "Name": "Tarishi Bishnoi",
                "Bio": "ROC expert with 3+ years of IT experience",
                "Certifications": "AWS Certified: Cloud practitioner",
                "Schedule": "Monday-Friday: 09-18",
                "Team": "Development Team",
                "Email": "TB00934207@TechMahindra.com"
            },
            {
                "Name": "Mayuresh Rajput",
                "Bio": "ROC expert with 3+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Friday-Tuesday: 03-11",
                "Team": "Support Team",
                "Email": "Mayuresh.Rajput@TechMahindra.com"
            },
            {
                "Name": "Gitanjali",
                "Bio": "ROC expert with 10+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Monday-Friday: 03-11",
                "Team": "Development Team",
                "Email": "GX00125033@TechMahindra.com"
            },
            {
                "Name": "Aryamol",
                "Bio": "ROC expert with 2+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Monday-Friday: 09-18",
                "Team": "QA Team",
                "Email": "Aryamol.KS@TechMahindra.com"
            },
            {
                "Name": "Harimar",
                "Bio": "ROC expert with 13+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Friday-Tuesday: 18-03",
                "Team": "Operations Team",
                "Email": "Harsimar.Singh@TechMahindra.com"
            },
            {
                "Name": "Deepak",
                "Bio": "ROC expert with 3+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Wednesday-Sunday: 18-03",
                "Team": "Support Team",
                "Email": "DP00818640@TechMahindra.com; "
            },
            {
                "Name": "Suresh",
                "Bio": "ROC expert with 10+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Monday-Friday: 18-03",
                "Team": "Development Team",
                "Email": "SK00498917@TechMahindra.com"
            },
            {
                "Name": "Sanjay",
                "Bio": "ROC expert with 20+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Saturday-Wednesday: 09-18",
                "Team": "Management Team",
                "Email": "SY00103977@TechMahindra.com"
            },
            {
                "Name": "Pranita",
                "Bio": "ROC expert with 3+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Tuesday-Saturday: 09-18",
                "Team": "QA Team",
                "Email": "PL00861745@TechMahindra.com"
            },
            {
                "Name": "Binil",
                "Bio": "ROC expert with 10+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Thursday-Monday: 09-18",
                "Team": "Operations Team",
                "Email": "BB00824803@TechMahindra.com"
            },
            {
                "Name": "Kuldeep",
                "Bio": "ROC expert with 13+ years of IT experience",
                "Certifications": "AI white belt",
                "Schedule": "Monday-Friday: 03-11",
                "Team": "Management Team",
                "Email": "KS0071361@TechMahindra.com"
            }
        ];
        
        try {
            console.log("Processing roster data:", rosterData.length, "records");
            
            // Process the roster data
            fileProcessor.processRosterDataFromSource(rosterData);
            
            // Save to localStorage for persistence
            localStorage.setItem('rosterData', JSON.stringify(rosterData));
            
            // Update the file info div
            fileInfoDiv.innerHTML = `
                <div class="message success-message">
                    <strong>ROSTER DATA LOADED!</strong>
                    <p>${rosterData.length} staff members loaded from roster.csv</p>
                </div>`;
            
            console.log("Successfully processed roster data");
        } catch (error) {
            console.error("Error processing roster data:", error);
            
            fileInfoDiv.innerHTML = `
                <div class="message error-message">
                    <strong>ERROR LOADING ROSTER DATA</strong>
                    <p>${error.message}</p>
                </div>`;
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Add event listeners as needed
        
        // Check for roster updates
        document.addEventListener('rosterUpdated', (event) => {
            console.log('Roster data updated:', event.detail.rosterData);
        });
    }
    
    /**
     * Add refresh button for manual data refresh
     */
    addRefreshDataButton() {
        const fileInfoDiv = document.getElementById('file-info');
        
        // Create a button element
        const refreshButton = document.createElement('button');
        refreshButton.id = 'refresh-data-btn';
        refreshButton.textContent = 'Refresh Roster Data';
        refreshButton.style.margin = '10px auto';
        refreshButton.style.display = 'block';
        refreshButton.style.backgroundColor = '#ff8c00';
        refreshButton.style.color = 'white';
        refreshButton.style.border = 'none';
        refreshButton.style.padding = '8px 16px';
        refreshButton.style.borderRadius = '4px';
        refreshButton.style.cursor = 'pointer';
        
        // Add button to file info div
        fileInfoDiv.appendChild(refreshButton);
        
        // Add event listener
        refreshButton.addEventListener('click', () => {
            // Clear localStorage first
            localStorage.clear();
            
            // Reload the data
            this.loadHardcodedRoster();
            
            // Update button appearance
            refreshButton.textContent = 'Data Refreshed!';
            refreshButton.style.backgroundColor = '#4CAF50';
        });
    }
    
    /**
     * Display error message
     */
    showError(message) {
        console.error(message);
        alert(`Error: ${message}`);
    }
}

// Create a global app instance
const app = new App();
