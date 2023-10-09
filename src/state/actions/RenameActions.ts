import { BUFFS_PATH, ITEMS_PATH, SKILLS_PATH, UNITS_PATH } from "../MapFiles"
import SaveChanges from "./SaveChanges"
import SendToGame from "./SendToGame"
import { DeleteJsonFileValue, RenameJsonFileValue, UpdateJsonFileValue } from "./UpdateText"

const pathMap = {
  unit: UNITS_PATH,
  item: ITEMS_PATH,
  skill: SKILLS_PATH,
  buff: BUFFS_PATH
}
export const RenameObject = (kind:"unit"|"item"|"skill"|"buff", oldType:string, newType:string) => {
  const path = pathMap[kind]
  
  RenameJsonFileValue(path, oldType, newType)
  UpdateJsonFileValue(path, `${newType}.type`, newType)
  SaveChanges()
  if(kind === "unit" || kind === "item"){
    SendToGame({
      method: `rename_${kind}_type`, 
      data: { oldType, newType }
    })
  }
}

export const DeleteEntity = (entity:"unit"|"item", type:string) => {  
  DeleteJsonFileValue(entity === "unit" ? UNITS_PATH : ITEMS_PATH, type)
  
  SendToGame({
    method: `delete_${entity}_type`, 
    data: { type }
  })
  SaveChanges()
}