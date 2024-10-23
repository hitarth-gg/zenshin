import Loader from './Loader'

export default function CenteredLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Loader />
    </div>
  )
}
