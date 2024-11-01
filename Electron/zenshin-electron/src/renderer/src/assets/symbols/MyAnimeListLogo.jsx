function MyAnimeListLogo({ style = '' }) {
  return (
    <div className={style !== '' ? `${style}` : `flex h-6 w-6 items-center justify-center`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/MyAnimeList_favicon.svg/256px-MyAnimeList_favicon.svg.png?20240412044336"
        alt=""
      />
    </div>
  )
}

export default MyAnimeListLogo
