/**
 * fileProcessor.js
 * Handles file upload and parsing for both Excel and CSV roster files
 */

class FileProcessor {
    constructor() {
        // Get DOM elements (safely, in case they don't exist)
        this.fileInfoDiv = document.getElementById('file-info');
        this.dataPersistenceStatusDiv = document.getElementById('data-persistence-status');
        
        // Roster data
        this.rosterData = null;
        
        // Check for saved data in localStorage
        this.loadFromLocalStorage();
    }
    
    /**
     * Update file info display
     */
    updateFileInfo(message) {
        if (this.fileInfoDiv) {
            this.fileInfoDiv.innerHTML = message || 'Roster data loaded';
        }
    }
    
    /**
     * Format file size in a readable format
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    /**
     * Process roster data from any source
     */
    processRosterDataFromSource(data) {
        if (!data) {
            this.showMessage('No data available', 'error');
            return;
        }
        
        console.log("Processing roster data from source, count:", data.length);
        console.log("First entry sample:", JSON.stringify(data[0], null, 2));
        this.showMessage('Processing roster data...', 'info');
        
        // Force clear localStorage before processing new data
        localStorage.clear();
        console.log("Cleared localStorage to ensure clean data processing");
        
        this.processRosterData(data);
    }
    
    /**
     * Parse CSV file using PapaParse
     */
    parseCSV(file) {
        Papa.parse(file, {
            header: true,
            delimiter: "",  // Auto-detect delimiter
            skipEmptyLines: true,
            complete: (results) => {
                console.log('CSV Parsing results:', results);
                
                if (results.errors && results.errors.length > 0) {
                    const errorMsg = results.errors[0].message;
                    console.error('CSV parsing error:', errorMsg, results);
                    this.showMessage('Error parsing CSV file: ' + errorMsg, 'error');
                    
                    // Show more detailed error information
                    if (results.data && results.data.length > 0) {
                        console.log('First row parsed:', results.data[0]);
                        const fields = Object.keys(results.data[0]).length;
                        console.log(`Fields detected: ${fields}`);
                        
                        if (fields < 4) {
                            this.showMessage('CSV format issue detected: Make sure your CSV has Name, Bio, Certifications, and Schedule columns with proper comma separation.', 'error');
                        }
                    }
                    return;
                }
                
                // Check if we have valid data
                if (!results.data || results.data.length === 0) {
                    this.showMessage('No valid data found in the CSV file.', 'error');
                    return;
                }
                
                this.processRosterData(results.data);
            },
            error: (error) => {
                console.error('CSV parsing error:', error);
                this.showMessage('Error parsing CSV file: ' + error.message, 'error');
            }
        });
    }
    
    /**
     * Parse Excel file using SheetJS
     */
    parseExcel(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                
                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                this.processRosterData(jsonData);
            } catch (error) {
                this.showMessage('Error parsing Excel file: ' + error.message, 'error');
            }
        };
        
        reader.onerror = () => {
            this.showMessage('Error reading file', 'error');
        };
        
        reader.readAsBinaryString(file);
    }
    
    /**
     * Process the parsed roster data
     */
    processRosterData(data) {
        console.log("Processing roster data:", data.length, "records");
        console.log("First record:", data[0]);
        
        // Validate that the data contains required fields
        if (!this.validateRosterData(data)) {
            this.showMessage('Invalid roster data format. Please make sure your file contains Name, Bio, Certifications, Schedule, Team, and Email columns. Note that column names are case-sensitive.', 'error');
            return;
        }
        
        // Store the processed data
        this.rosterData = data;
        
        // Display first few entries for debugging
        console.log("First few entries:");
        data.slice(0, 3).forEach((entry, index) => {
            console.log(`Entry ${index + 1}:`, entry);
        });
        
        // Save to localStorage
        this.saveToLocalStorage();
        
        // Show success message
        this.showMessage('Roster file processed successfully!', 'success');
        
        // Trigger availability check
        document.dispatchEvent(new CustomEvent('rosterUpdated', { detail: { rosterData: this.rosterData } }));
    }
    
    /**
     * Validate the roster data structure
     */
    validateRosterData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            console.error("Data validation failed: Not an array or empty array");
            return false;
        }
        
        console.log("Validating data sample:", data[0]);
        
        // Check if at least one record has the required fields
        const requiredFields = ['Name', 'Bio', 'Certifications', 'Schedule', 'Team', 'Email'];
        const sampleRecord = data[0];
        
        // Print all field names for debugging
        const fieldNames = Object.keys(sampleRecord);
        console.log("Field names in data:", fieldNames);
        
        // Additional debugging for roster data
        console.log("Full sample record for debugging:", JSON.stringify(sampleRecord, null, 2));
        
        // Special handling for missing Team field - check for TeamsID and map it
        const hasTeamField = fieldNames.includes('Team') || fieldNames.some(key => key.toLowerCase() === 'team');
        const hasTeamsIDField = fieldNames.includes('TeamsID') || fieldNames.some(key => key.toLowerCase() === 'teamsid');
        
        if (!hasTeamField && hasTeamsIDField) {
            console.log("Found TeamsID field but no Team field - mapping TeamsID to Team");
            data.forEach(record => {
                // Find the TeamsID field regardless of case
                const teamsIDKey = Object.keys(record).find(key => key.toLowerCase() === 'teamsid');
                if (teamsIDKey) {
                    // Add a Team field with a default value or based on TeamsID
                    record['Team'] = "ROC Team";
                    console.log("Added Team field to record:", record.Name);
                }
            });
        }
        
        // Fix any casing issues in the keys
        data.forEach(record => {
            // Create a mapping of lowercase field name to actual field name
            const fieldMap = {};
            Object.keys(record).forEach(key => {
                fieldMap[key.toLowerCase()] = key;
            });
            
            // Create a new record with standardized field names
            const newRecord = {};
            requiredFields.forEach(field => {
                const lowerField = field.toLowerCase();
                if (fieldMap[lowerField]) {
                    // If field exists with a different case, use the value but with correct case
                    newRecord[field] = record[fieldMap[lowerField]];
                }
            });
            
            // Copy over the standardized fields
            requiredFields.forEach(field => {
                if (newRecord[field] !== undefined) {
                    record[field] = newRecord[field];
                }
            });
        });
        
        // Check that all required fields exist after standardization
        const allFieldsExist = requiredFields.every(field => 
            fieldNames.some(key => key === field || key.toLowerCase() === field.toLowerCase())
        );
        
        if (!allFieldsExist) {
            console.error("Missing required fields after standardization");
            
            // More detailed error message
            const missingFields = requiredFields.filter(field => 
                !fieldNames.some(key => key === field || key.toLowerCase() === field.toLowerCase())
            );
            
            console.error("Missing fields:", missingFields);
            return false;
        }
        
        // All fields are found
        return true;
    }
    
    /**
     * Display a message to the user
     */
    showMessage(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        if (!this.fileInfoDiv) {
            console.error("Cannot show message: fileInfoDiv not found");
            return;
        }
        
        // Remove any existing message
        const existingMsg = this.fileInfoDiv.querySelector('.message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Create message element
        const msgElement = document.createElement('div');
        msgElement.className = `message ${type}-message`;
        msgElement.textContent = message;
        
        // Add to the page
        this.fileInfoDiv.appendChild(msgElement);
        
        // Auto-remove success/info messages after 5 seconds
        if (type !== 'error') {
            setTimeout(() => {
                if (msgElement.parentNode) {
                    msgElement.remove();
                }
            }, 5000);
        }
    }
    
    /**
     * Save roster data to localStorage
     */
    saveToLocalStorage() {
        try {
            const now = new Date().toISOString();
            localStorage.setItem('rosterData', JSON.stringify(this.rosterData));
            localStorage.setItem('lastUpdated', now);
            
            // Update persistence status
            this.updateDataPersistenceStatus(true, now);
            
            console.log('Data saved to localStorage successfully');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.updateDataPersistenceStatus(false, null, error);
        }
    }
    
    /**
     * Load roster data from localStorage
     */
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('rosterData');
            if (savedData) {
                console.log('Found saved roster data in localStorage');
                this.rosterData = JSON.parse(savedData);
                const lastUpdated = localStorage.getItem('lastUpdated');
                
                this.fileInfoDiv.innerHTML = `<div class="message info-message">Loaded saved roster data. Last updated: ${this.formatDate(lastUpdated)}</div>`;
                
                // Show persistence status
                this.updateDataPersistenceStatus(true, lastUpdated);
                
                // Trigger availability check
                setTimeout(() => {
                    console.log('Triggering availability check with saved data');
                    document.dispatchEvent(new CustomEvent('rosterUpdated', { detail: { rosterData: this.rosterData } }));
                }, 500); // Delay to ensure all components are loaded
                
                return true; // Indicate data was loaded
            } else {
                // No data found
                this.updateDataPersistenceStatus(false);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.updateDataPersistenceStatus(false, null, error);
        }
        return false; // Indicate no data was loaded
    }
    
    /**
     * Update the data persistence status display
     */
    updateDataPersistenceStatus(dataLoaded, lastUpdated = null, error = null) {
        if (!this.dataPersistenceStatusDiv) return;
        
        if (dataLoaded) {
            this.dataPersistenceStatusDiv.textContent = `Your data is automatically saved. No need to re-upload on page refresh. Last saved: ${this.formatDate(lastUpdated)}`;
        } else if (error) {
            this.dataPersistenceStatusDiv.textContent = `Error loading saved data: ${error.message}`;
        } else {
            this.dataPersistenceStatusDiv.textContent = `Upload a roster file to automatically save it for future sessions`;
        }
    }
    
    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        
        const date = new Date(dateString);
        return date.toLocaleString();
    }
    
    /**
     * Get the roster data
     */
    getRosterData() {
        return this.rosterData;
    }
}

// Create a global fileProcessor instance
const fileProcessor = new FileProcessor();