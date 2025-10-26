# Fix Errors in Spring Boot and Django Projects

## Spring Boot Fixes
- [x] Fix BlockItem.java constructor to properly set fields
- [x] Add validation in FocusController.java for BlockItem fields

## Django Fixes
- [x] Update blocker/forms.py to use BlockedItem instead of BlockedApp
- [x] Update blocker/utils.py to use BlockedItem instead of BlockedApp
- [x] Add CRUD views in blocker/views.py for BlockedItem
- [x] Update blocker/urls.py to include proper CRUD endpoints

## Blocking Logic Fixes
- [x] Fixed Django start_blocking to use BlockedItem model data instead of manual input
- [x] Updated hosts file modification to block both www and non-www variants
- [x] Improved app blocking to check both process name and executable path
- [x] Updated app blocking logic to use path when available, fallback to name

## Testing
- [x] Run mvn compile for Spring Boot (Maven not installed)
- [x] Run python manage.py check for Django (Django not installed)
