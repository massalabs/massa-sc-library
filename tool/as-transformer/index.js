import {TransformVisitor, SimpleParser} from "visitor-as/dist/index.js";
import {IdentifierExpression} from "assemblyscript/dist/assemblyscript.js";

import fs from "fs";

class MyTransform extends TransformVisitor {

    visitCallExpression(node) {
        if (node.expression instanceof IdentifierExpression) {
            if (node.expression.text == "include_base64") {
                //reads file and encodes it in base64
                //args is the argument of include_base64 function call.
                let data = fs.readFileSync(node.args[0].value).toString('base64');
                //removes the call to include_base64 and inserts encoded data.
                let res = SimpleParser.parseExpression('"' + data + '"');
                res.range = node.range;
                return res;
            }
        }
        return super.visitCallExpression(node);
    }
    afterParse(parser) {
      for (const source of parser.sources) {
      // Ignore all lib (std lib). Visit everything else.
      if (!source.isLibrary && !source.internalPath.startsWith(`~lib/`)) {
        this.visit(source);
      }
    }

}}

const mt =  new MyTransform();

export { mt };
