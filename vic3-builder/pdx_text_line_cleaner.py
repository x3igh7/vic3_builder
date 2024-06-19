import re

class PdxTextLineCleaner:
    def __init__(self, lines):
        self.lines = lines

    def clean(self, callback):
        cleanLines = []
        for x in self.lines:
            newLine = x.replace('\n', '')
            newLine = newLine.replace('\t', '')
            newLine = newLine.replace('\u00ef', '')
            cleanLines.append(newLine)

        return self.constructDict(cleanLines, callback)
    
    def constructDict(self, cleanLines, callback):
        openBracketCount = 0
        closeBracketCount = 0
        itemDict = {}
        itemDictList = []
        for x in cleanLines:
            if "{" in x:
                if openBracketCount == 0:
                    name = re.sub(r'\W', '', x)
                    itemDict["name"] = name
                openBracketCount += 1
            
            # run custom callback function
            itemDict = callback(x, itemDict)

            if "}" in x:
                closeBracketCount += 1
            if openBracketCount != 0 and openBracketCount == closeBracketCount:
                itemDictList.append(itemDict)
                itemDict = {}
                openBracketCount = 0
                closeBracketCount = 0
        return itemDictList
    