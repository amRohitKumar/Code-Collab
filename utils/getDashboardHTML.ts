function getDashboardHTML(files?: models.ICodeFile[]) {
  if (!files) return "";

  const htmlcontent = files.find((file) => file.language === "HTML");
  const csscontent = files.find((file) => file.language === "CSS");

  const outputDoc = `
  <html>
    <body>${htmlcontent?.code}</body>
    <style>body{transform: scale(1); background-color: white}${csscontent?.code}</style>
  </html>
`;
  return outputDoc;
}

export default getDashboardHTML;
