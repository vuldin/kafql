export default function Building() {
  return (
    <>
      <span>
        A top-down view of a building with rooms that each have attributes like temperature,
        location, etc. People are displayed throughout various rooms, and they move from room to
        room as events come in. Lights and AC toggle on/off, windows open/close.
      </span>
      <pre>{`
 ------------
| X | X |   |
|- --- --- -|
|   |   |   |
|- --- --- -|
| X |   |   |
 ------------
      `}</pre>
    </>
  )
}
