import { TFile, TStatusId } from '@/shared/model'

export type TDisplayValues = {
  title: string
  description: string
  teacher: string
  student: string
  answer: string
  files: TFile[]
  file_answer: TFile[]
  status?: TStatusId
}
