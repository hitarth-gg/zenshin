function AniListLogo({ style = '' }) {
  return (
    <div className={style !== '' ? `${style}` : `h-6 w-6 flex items-center justify-center`}>
      <img src="https://anilist.co/img/icons/icon.svg" alt="" />
    </div>
  )
}

export default AniListLogo
