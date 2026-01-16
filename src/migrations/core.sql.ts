export function addColumnToTable(table: string, column: string, dataType: string) {
  return `ALTER TABLE ${table} ADD COLUMN ${column} ${dataType};`
}
