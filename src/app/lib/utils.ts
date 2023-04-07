export default function get_input(file: File) {
  var result;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target?.result as string;
    const rows = text.split("\n");
    for (let row of rows) {
      const cols = row.split(" ");
      let cols_result = "";
      for (let i = 1; i < cols.length; i++) {
        cols_result += cols[i] + " ";
      }
      console.log(cols_result);
    }
    result = text;
  };

  reader.readAsText(file);
}
