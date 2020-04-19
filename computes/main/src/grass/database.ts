import axios from "axios"
import { Firestore } from "@google-cloud/firestore"

interface Grass {
  today: number
  week: number
  year: number
  image: string
}
interface GrassDoc extends Grass {
  name: string
  isEnable: boolean
  isDark: boolean
}
const isGrass = (item: any): item is Grass =>
  typeof item?.today === "number" &&
  typeof item?.week === "number" &&
  typeof item?.year === "number" &&
  typeof item?.image === "string"
const isGrassDoc = (item: any): item is GrassDoc =>
  typeof item?.name === "string" &&
  typeof item?.isEnable === "boolean" &&
  typeof item?.isDark === "boolean" &&
  isGrass(item)

const database = new Firestore()
const grassCollection = () => database.collection("grass")

export async function fetchGrass(
  name: string,
  isDark: boolean,
): Promise<Grass | null> {
  const url = process.env.GET_GRASS_URL
  if (!url) throw new Error("env is undefined")
  return axios
    .post(url, { name, dark: isDark })
    .then((res) => (isGrass(res.data) ? res.data : null))
    .catch(() => null)
}

export async function setGrass(userId: string, grass: GrassDoc): Promise<void> {
  await grassCollection()
    .doc(userId)
    .set({
      today: grass.today,
      week: grass.week,
      year: grass.year,
      image: grass.image,
      name: grass.name,
      isEnable: grass.isEnable,
      isDark: grass.isDark,
    } as GrassDoc)
}

export async function getGrass(userId: string): Promise<GrassDoc | null> {
  const ref = await grassCollection().doc(userId).get()
  const grass = ref.data()
  return isGrassDoc(grass) ? grass : null
}
