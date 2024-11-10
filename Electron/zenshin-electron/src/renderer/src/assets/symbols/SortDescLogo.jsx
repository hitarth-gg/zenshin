function SortDescLogo({ style = '' }) {
  return (
    <div className={style !== '' ? `${style}` : `flex h-6 w-6 items-center justify-center`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        className="fill-current"
        viewBox="0 0 256 256"
      >
        <path d="M128,128a8,8,0,0,1-8,8H48a8,8,0,0,1,0-16h72A8,8,0,0,1,128,128ZM48,72H184a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16Zm56,112H48a8,8,0,0,0,0,16h56a8,8,0,0,0,0-16Zm125.66-21.66a8,8,0,0,0-11.32,0L192,188.69V112a8,8,0,0,0-16,0v76.69l-26.34-26.35a8,8,0,0,0-11.32,11.32l40,40a8,8,0,0,0,11.32,0l40-40A8,8,0,0,0,229.66,162.34Z"></path>
      </svg>
    </div>
  )
}

export default SortDescLogo
