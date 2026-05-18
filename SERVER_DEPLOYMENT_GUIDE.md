# Server Deployment Guide for ROC Availability Tracker

This guide will help you deploy the ROC Availability Tracker application on a web server so that it can be accessed by all users on your network or the internet.

## Overview

The ROC Availability Tracker is a static web application (HTML, CSS, and JavaScript) that runs entirely in the browser. This makes it very easy to deploy on any web server. Below are the steps to deploy it on a server you access via PuTTY or other SSH client.

## Deployment Steps

### 1. Prepare Your Server

Ensure your server has a web server installed. Common options include:

- **Apache**: Most common web server, available on virtually all Linux/Unix distributions
- **Nginx**: High-performance web server, popular for its speed and efficiency
- **IIS**: Microsoft's web server for Windows servers

If you don't have a web server installed, you can install Apache on most Linux systems with:

```bash
# For Debian/Ubuntu
sudo apt update
sudo apt install apache2

# For CentOS/RHEL
sudo yum install httpd
sudo systemctl start httpd
sudo systemctl enable httpd
```

### 2. Connect to Your Server

Connect to your server using PuTTY or another SSH client:

1. Open PuTTY
2. Enter your server's hostname or IP address
3. Enter port 22 (default SSH port)
4. Click "Open"
5. Enter your username and password when prompted

### 3. Create a Directory for the Application

Create a directory in your web server's document root:

```bash
# For Apache on Debian/Ubuntu
sudo mkdir -p /var/www/html/roc-tracker

# For Apache on CentOS/RHEL
sudo mkdir -p /var/www/html/roc-tracker

# For Nginx
sudo mkdir -p /usr/share/nginx/html/roc-tracker
```

### 4. Upload Files to Server

There are several ways to upload the files:

#### Option A: Using SCP (Secure Copy)

From your local machine (not via PuTTY), use SCP to upload the ZIP file:

```bash
scp roc-availability-tracker.zip username@your-server-ip:/tmp/
```

Then, on the server via PuTTY:

```bash
sudo apt install unzip  # If unzip is not already installed
cd /var/www/html/roc-tracker
sudo unzip /tmp/roc-availability-tracker.zip -d .
```

#### Option B: Using SFTP

1. Use an SFTP client like FileZilla or WinSCP
2. Connect to your server using the same credentials as PuTTY
3. Navigate to your web server's document root
4. Upload all files from the `l1-availability-tracker` directory or the `roc-availability-tracker.zip` file (extract it after uploading)

#### Option C: Using a temporary HTTP server on your local machine

1. On your local machine, start a temporary HTTP server:
   ```bash
   # Using Python (from the directory containing roc-availability-tracker.zip)
   python -m http.server 8000
   ```
2. On your server via PuTTY:
   ```bash
   cd /tmp
   wget http://your-local-ip:8000/roc-availability-tracker.zip
   sudo unzip roc-availability-tracker.zip -d /var/www/html/roc-tracker/
   ```

### 5. Set Correct Permissions

Ensure the web server can read the files:

```bash
sudo chown -R www-data:www-data /var/www/html/roc-tracker  # For Apache on Debian/Ubuntu
sudo chown -R apache:apache /var/www/html/roc-tracker       # For Apache on CentOS/RHEL
sudo chown -R nginx:nginx /usr/share/nginx/html/roc-tracker # For Nginx
```

### 6. Configure Virtual Host (Optional but Recommended)

For Apache, create a virtual host:

```bash
sudo nano /etc/apache2/sites-available/roc-tracker.conf
```

Add this configuration:

```apache
<VirtualHost *:80>
    ServerName roc-tracker.your-domain.com
    ServerAlias roc-tracker
    DocumentRoot /var/www/html/roc-tracker
    
    <Directory /var/www/html/roc-tracker>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/roc-tracker_error.log
    CustomLog ${APACHE_LOG_DIR}/roc-tracker_access.log combined
</VirtualHost>
```

Enable the virtual host:

```bash
sudo a2ensite roc-tracker.conf
sudo systemctl reload apache2
```

### 7. Update DNS (If Using a Domain Name)

If you want to use a domain name:

1. Configure your DNS settings to point your domain or subdomain to your server's IP address
2. Wait for DNS propagation (can take up to 24-48 hours but often much quicker)

### 8. Test the Deployment

Access the application:

- If using a domain name: `http://roc-tracker.your-domain.com`
- If using an IP address: `http://your-server-ip/roc-tracker`

## Data Storage Considerations

The ROC Availability Tracker uses the browser's localStorage to store data. This means:

1. Each user's data is stored in their own browser
2. Data is not shared between users
3. Data is not stored on the server

If you need shared data storage, you would need to modify the application to use a server-side database. This would require significant changes to the application.

## Security Considerations

For production use, especially if accessible from the internet:

1. **Enable HTTPS**: Use Let's Encrypt for free SSL certificates
   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d roc-tracker.your-domain.com
   ```

2. **Set Up Authentication**: Consider adding HTTP Basic Authentication or another authentication method if you need to restrict access

## Automatic Updates (Optional)

If you plan to make frequent updates to the application, consider setting up a Git repository and a deployment workflow:

1. Create a Git repository for the application
2. Set up a webhook or CI/CD pipeline to automatically deploy changes
3. Use a tool like Jenkins, GitHub Actions, or GitLab CI to automate the deployment process

## Troubleshooting

If the application is not accessible:

1. Check your firewall settings to ensure port 80 (HTTP) and/or 443 (HTTPS) are open
2. Verify the web server is running: `sudo systemctl status apache2` or `sudo systemctl status nginx`
3. Check the web server error logs for any issues
4. Ensure file permissions allow the web server to read the files
5. Test with a simple HTML file to verify the web server is serving files correctly