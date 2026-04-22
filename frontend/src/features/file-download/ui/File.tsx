import { TFile } from '@/shared/model'
import { FileItem } from '@/shared/ui'
import { useDownloadFile } from '../model/use-download-file'

interface IFileProps {
  el: TFile
}

export const FileDownload = ({ el }: IFileProps) => {
  const { download } = useDownloadFile(el.name)

  return (
    <FileItem
      file={{ id: el.id.toString(), name: el.name }}
      onDownload={(id) => download(Number(id))}
    />
  )
}
