const bulbColors = ['red', 'gold', 'green', 'cream', 'red', 'green', 'gold', 'cream', 'red', 'gold', 'green', 'cream']

export function FestiveLights() {
  return (
    <div className="festive-lights" aria-hidden="true">
      {bulbColors.map((color, index) => <i className={`bulb bulb-${color}`} style={{ animationDelay: `${index * .17}s` }} key={`${color}-${index}`} />)}
    </div>
  )
}
