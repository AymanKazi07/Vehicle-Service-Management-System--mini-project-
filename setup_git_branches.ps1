# setup_git_branches.ps1
# Automates the 4-part Git branch setup for 4 team members

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  AutoServe 4-Member Git Branch Initializer   " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Initialize Git repository
if (-not (Test-Path ".git")) {
    Write-Host "Initializing new Git repository on main branch..." -ForegroundColor Green
    git init -b main
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

# 2. Check Git user config
$userName = git config user.name
if (-not $userName) {
    git config user.name "AutoServe Developer"
    git config user.email "developer@autoserve.com"
    Write-Host "Configured default local Git user (AutoServe Developer)." -ForegroundColor Yellow
}

# 3. Create Part 1 Branch (Member 1)
Write-Host "`n[1/4] Staging Part 1: Backend Core, Models & Persistence..." -ForegroundColor Cyan
git checkout -B part-1-backend-core
git add .gitignore
git add backend/pom.xml
git add backend/src/main/resources/
git add backend/data/
git add backend/src/main/java/com/vehicleservice/VehicleServiceApplication.java
git add backend/src/main/java/com/vehicleservice/config/
git add backend/src/main/java/com/vehicleservice/model/
git add backend/src/main/java/com/vehicleservice/store/
git commit -m "feat(backend): add Spring Boot core, security config, domain models, and JSON storage engine"

# 4. Create Part 2 Branch (Member 2)
Write-Host "`n[2/4] Staging Part 2: Backend Services, Scheduler & Controllers..." -ForegroundColor Cyan
git checkout -B part-2-backend-services
git add backend/src/main/java/com/vehicleservice/scheduler/
git add backend/src/main/java/com/vehicleservice/service/
git add backend/src/main/java/com/vehicleservice/controller/
git add backend/src/main/java/com/vehicleservice/dto/
git add backend/src/main/java/com/vehicleservice/exception/
git commit -m "feat(backend): implement dual-queue slot allocator, service layer, DTOs, and REST controllers"

# 5. Create Part 3 Branch (Member 3)
Write-Host "`n[3/4] Staging Part 3: Frontend Infrastructure, State & API Layer..." -ForegroundColor Cyan
git checkout -B part-3-frontend-infra
git add frontend/package.json
git add frontend/package-lock.json
git add frontend/vite.config.js
git add frontend/index.html
git add frontend/.env.example
git add frontend/src/main.jsx
git add frontend/src/App.jsx
git add frontend/src/styles/app.css
git add frontend/src/context/
git add frontend/src/routes/
git add frontend/src/utils/
git add frontend/src/api/
git commit -m "feat(frontend): set up Vite, modern design system, AuthContext, Axios client, and mock store"

# 6. Create Part 4 Branch (Member 4)
Write-Host "`n[4/4] Staging Part 4: Frontend UI Pages, Feature Components & Tests..." -ForegroundColor Cyan
git checkout -B part-4-frontend-ui
git add frontend/src/pages/
git add frontend/src/components/
git add backend/src/test/
git add README.md
git add PRD_Vehicle_Service_Booking_V2.md
git add Architecture_Vehicle_Service_Booking.md
git add CODEBASE_EXPLANATION.md
git add GITHUB_COLLABORATION_GUIDE.md
git add setup_git_branches.bat
git add setup_git_branches.ps1
git commit -m "feat(frontend): build all UI pages, 16 interactive components, and comprehensive test suite"

# 7. Merge all cleanly into main
Write-Host "`nPointing unified main branch to latest part..." -ForegroundColor Green
git checkout -B main part-4-frontend-ui
git merge part-1-backend-core --no-edit
git merge part-2-backend-services --no-edit
git merge part-3-frontend-infra --no-edit
git merge part-4-frontend-ui --no-edit

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host " SUCCESS! All 4 parts are staged into 4 distinct branches." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Branches ready:
  1. part-1-backend-core
  2. part-2-backend-services
  3. part-3-frontend-infra
  4. part-4-frontend-ui
  5. main (unified codebase)" -ForegroundColor White

Write-Host "`nTo push to GitHub, run:
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
  git push --all origin" -ForegroundColor Yellow
