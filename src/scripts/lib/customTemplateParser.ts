class CustomTemplateParser {
  templateMap = {};
  templateStr = "";
  regexParser: RegExp;
  constructor(templateMap: CustomTemplateParserMap, templateStr: string){
    this.templateMap = templateMap;
    this.templateStr = templateStr;
    this.regexParser = new RegExp(/{{\s*(.*?)\s*}}/);
  }
  parse():string {
    let strMatch = this.templateStr.match(this.regexParser);
    while (strMatch) {
      this.templateStr = this.templateStr.replace(strMatch[0], this.templateMap[strMatch[1]]());
      strMatch = this.templateStr.match(this.regexParser);
    }
    return this.templateStr;
  };
}

export default CustomTemplateParser;
