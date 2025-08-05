#!/bin/sh

# ===== Colors =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===== Logging =====
info()    { printf "${BLUE}[INFO]${NC} %s\n" "$1"; }
warn()    { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; }
error()   { printf "${RED}[ERROR]${NC} %s\n" "$1"; }
success() { printf "${GREEN}[OK]${NC} %s\n" "$1"; }

# ===== Wait Function =====
wait() {
  SECONDS="${1:-3}"
  printf "${YELLOW}[WAIT]${NC} Sleeping for %s seconds...\n" "$SECONDS"
  sleep "$SECONDS"
}

# ===== Check Function =====
check() {
  CMD="$1"
  MSG="${2:-$CMD}"

  if sh -c "$CMD"; then
    success "$MSG"
  else
    error "$MSG"
    return 1
  fi
}

# ===== Insert content into a file if not already present =====
# Usage: insert_into_file "<file>" "<marker or line to match>" "<text to insert>" ["after"|"before"|"end"]
insert_into_file() {
  FILE="$1"
  MARKER="$2"
  INSERT="$3"
  POSITION="${4:-after}" # after|before|end

  if grep -Fq "$INSERT" "$FILE" 2>/dev/null; then
    info "Insert already present in $FILE"
    return 0
  fi

  if [ ! -f "$FILE" ]; then
    warn "$FILE not found. Creating new file."
    echo "$INSERT" > "$FILE"
    success "Created $FILE with insert"
    return 0
  fi

  TMP=$(mktemp)

  case "$POSITION" in
    after)
      awk -v m="$MARKER" -v i="$INSERT" '
        { print }
        $0 ~ m { print i }
      ' "$FILE" > "$TMP"
      ;;
    before)
      awk -v m="$MARKER" -v i="$INSERT" '
        $0 ~ m { print i }
        { print }
      ' "$FILE" > "$TMP"
      ;;
    end)
      cat "$FILE" > "$TMP"
      echo "$INSERT" >> "$TMP"
      ;;
    *)
      error "Invalid insert position: $POSITION"
      rm "$TMP"
      return 1
      ;;
  esac

  mv "$TMP" "$FILE"
  success "Inserted into $FILE"
}

# ===== Add line if not exists =====
add_line_if_not_exists() {
  FILE="$1"
  LINE="$2"

  if [ ! -f "$FILE" ]; then
    warn "$FILE does not exist. Creating it."
    echo "$LINE" > "$FILE"
    success "Created $FILE and added the line."
    return 0
  fi

  if ! grep -Fxq "$LINE" "$FILE"; then
    echo "$LINE" >> "$FILE"
    success "Added line to $FILE"
  else
    info "Line already present in $FILE"
  fi
}

# ===== Check if file exists =====
file_exists() {
  FILE="$1"
  if [ -f "$FILE" ]; then
    success "File '$FILE' exists."
    return 0
  else
    warn "File '$FILE' does not exist."
    return 1
  fi
}

# ===== Generic multiple-choice question helper =====
# Usage: ask_choice "Your question" "option1 option2 option3"
# Returns the valid chosen option (case preserved)
ask_choice() {
  QUESTION="$1"
  OPTIONS="$2"

  while true; do
    printf "${BLUE}%s (%s): ${NC}" "$QUESTION" "$OPTIONS"
    read -r ANSWER

    for opt in $OPTIONS; do
      # Case-insensitive match
      if [ "$(echo "$ANSWER" | tr '[:upper:]' '[:lower:]')" = "$(echo "$opt" | tr '[:upper:]' '[:lower:]')" ]; then
        echo "$opt"
        return 0
      fi
    done

    printf "${YELLOW}Invalid option. Please choose one of: %s${NC}\n" "$OPTIONS"
  done
}

# ===== Installs =====
info "Setting up database..."
wait 1

check "bun add drizzle-orm" "Installed drizzle-orm"
check "bun add drizzle-kit -D" "Installed drizzle-kit (dev dependency)"

info "Installation complete"
info "Checking if drizzle.config.ts exists..."
wait 1

if file_exists "drizzle.config.ts"; then
  info "drizzle.config.ts exists"
  # Fixed: This logic was backwards - if file exists, don't exit
else
  error "drizzle.config.ts does not exist"
  touch drizzle.config.ts
  success "Created drizzle.config.ts"
fi

# ===== Database Selection =====
DB=$(ask_choice "Choose your database" "sqlite postgresql")
echo "You chose: $DB"

if [ "$DB" = "sqlite" ]; then
  info "Setting up SQLite"
  check "bun add better-sqlite3" "Installed better-sqlite3"
else
  info "Setting up PostgreSQL"
  NEON=$(ask_choice "Are you going to use Neon?" "yes no")
  
  if [ "$NEON" = "yes" ]; then
    info "Setting up with Neon"
    check "bun add @neondatabase/serverless" "Installed Neon serverless driver"
  else
    info "Setting up standard PostgreSQL"
    check "bun add pg" "Installed pg"
    check "bun add @types/pg -D" "Installed pg types"
  fi
fi

info 'Adding data to config'

# Create the drizzle config content based on database choice
if [ "$DB" = "sqlite" ]; then
  DRIZZLE_CONFIG="import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db',
  },
});"
else
  DRIZZLE_CONFIG="import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});"
fi

# Write the config to the file
if [ -f "drizzle.config.ts" ] && [ -s "drizzle.config.ts" ]; then
  info "drizzle.config.ts already has content, skipping..."
else
  echo "$DRIZZLE_CONFIG" > "drizzle.config.ts"
  success "Added configuration to drizzle.config.ts"
fi

info "Database setup complete!"