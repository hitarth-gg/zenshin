function YouTubeLogo({ style = '' }) {
  return (
    <div className={style !== '' ? `${style}` : `h-6 w-6 flex items-center justify-center brightness-90`}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/YouTube_full-color_icon_%282024%29.svg/1024px-YouTube_full-color_icon_%282024%29.svg.png"
        alt=""
      />
    </div>
  )
}

export default YouTubeLogo
