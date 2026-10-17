import { useEffect, useRef, useState } from 'react'
import Button from '../shared/button/Button'
import ConfirmModal from '../confirmModal/ConfirmModal'
import { successToast, errorToast } from '../../shared/notifications'
import { getErrorMessage, getPhotoUrl } from '../../shared/api'
import { getPhotos, uploadPhoto, deletePhoto } from './PhotoManager.server'
import './PhotoManager.scss'

const PhotoManager = ({ propertyId, token, onPhotosChange }) => {
  const [photos, setPhotos] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [photoToDelete, setPhotoToDelete] = useState(null)

  // Para vaciar el input de archivo después de subir
  const fileInputRef = useRef(null)

  useEffect(() => {
    getPhotos(propertyId, {
      onSuccess: (data) => setPhotos(data),
      onError: (err) => console.error('getPhotos failed:', err),
    })
  }, [propertyId])

  const handleUpload = () => {
    if (!selectedFile) {
      errorToast('Primero elegí una imagen.')
      return
    }

    setIsUploading(true)
    uploadPhoto(propertyId, selectedFile, token, {
      onSuccess: (photo) => {
        setPhotos((prev) => [...prev, photo])
        setSelectedFile(null)
        fileInputRef.current.value = ''
        setIsUploading(false)
        successToast('Foto subida correctamente.')
        onPhotosChange()
      },
      onError: (err) => {
        console.error('uploadPhoto failed:', err)
        errorToast(getErrorMessage(err))
        setIsUploading(false)
      },
    })
  }

  const handleConfirmDelete = () => {
    const photoId = photoToDelete.id
    setPhotoToDelete(null)

    deletePhoto(photoId, token, {
      onSuccess: (deletedId) => {
        setPhotos((prev) => prev.filter((photo) => photo.id !== deletedId))
        successToast('Foto eliminada.')
        onPhotosChange()
      },
      onError: (err) => {
        console.error('deletePhoto failed:', err)
        errorToast(getErrorMessage(err))
      },
    })
  }

  const photosMapped = photos.map((photo) => (
    <li key={photo.id} className="photo-manager__item">
      <img className="photo-manager__photo" src={getPhotoUrl(photo)} alt={`Foto ${photo.id}`} />
      <Button variant="danger" size="sm" onClick={() => setPhotoToDelete(photo)}>Eliminar</Button>
    </li>
  ))

  return (
    <section className="photo-manager">
      <h2 className="photo-manager__title">Fotos</h2>

      {photos.length > 0
        ? <ul className="photo-manager__list">{photosMapped}</ul>
        : <p className="photo-manager__empty">Esta propiedad todavía no tiene fotos.</p>}

      <div className="photo-manager__upload">
        <input
          ref={fileInputRef}
          className="photo-manager__file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setSelectedFile(event.target.files[0] ?? null)}
        />
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Subiendo…' : 'Subir foto'}
        </Button>
      </div>
      <p className="photo-manager__hint">JPG, PNG o WEBP de hasta 5 MB.</p>

      <ConfirmModal
        open={photoToDelete !== null}
        title="Eliminar foto"
        message="¿Seguro que querés eliminar esta foto? No se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPhotoToDelete(null)}
      />
    </section>
  )
}

export default PhotoManager
