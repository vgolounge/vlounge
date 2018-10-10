#!/bin/bash

cd /var/www/vgo-www

# Update composer
sudo composer install --no-dev --no-scripts --optimize-autoloader

# Setup the various file and folder permissions for Lumen
sudo chown -R www-data:www-data /var/www/vgo-www
sudo find /var/www/vgo-www -type f -exec chmod 644 {} \;
sudo find /var/www/vgo-www -type d -exec chmod 755 {} \;
sudo chgrp -R www-data storage/framework/cache
sudo chmod -R ug+rwx storage/framework/cache

# Run artisan commands for Lumen
php artisan cache:clear

# Restart Lumen queue workers by restarting supervisor
#sudo supervisorctl restart all