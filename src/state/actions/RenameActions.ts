import { ITEMS_PATH, UNITS_PATH } from "../MapFiles"
import SaveChanges from "./SaveChanges"
import SendToGame from "./SendToGame"
import { DeleteJsonFileValue, RenameJsonFileValue, UpdateJsonFileValue } from "./UpdateText"

export const RenameEntity = (entity:"unit"|"item", oldType:string, newType:string) => {
  const path = entity === "unit" ? UNITS_PATH : ITEMS_PATH
  
  RenameJsonFileValue(path, oldType, newType)
  UpdateJsonFileValue(path, `${newType}.type`, newType)
  SaveChanges()
  SendToGame({
    method: `rename_${entity}_type`, 
    data: { oldType, newType }
  })
}

export const DeleteEntity = (entity:"unit"|"item", type:string) => {  
  DeleteJsonFileValue(entity === "unit" ? UNITS_PATH : ITEMS_PATH, type)
  
  SendToGame({
    method: `delete_${entity}_type`, 
    data: { type }
  })
  SaveChanges()
}