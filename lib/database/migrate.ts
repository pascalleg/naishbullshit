import { supabase } from "../supabase"
import fs from "fs"
import path from "path"

async function applyMigration(sql: string) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) {
    console.error("Migration failed:", error)
    throw error
  }
}

async function migrate() {
  try {
    // Read and apply the production tables migration
    const migrationPath = path.join(__dirname, "001_production_tables.sql")
    const sql = fs.readFileSync(migrationPath, "utf8")
    
    console.log("Applying production tables migration...")
    await applyMigration(sql)
    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  migrate()
}

export { migrate } 