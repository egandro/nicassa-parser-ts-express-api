// taken from https://github.com/lukeautry/tsoa
import * as ts from 'typescript';
import { Controller } from '../persistance/metadata';
import { MethodGenerator } from './methodGenerator';

export class ControllerGenerator {
    private readonly pathValue: string | undefined;
    private readonly jwtUserProperty: string | undefined;

    constructor(private readonly node: ts.ClassDeclaration) {
        this.pathValue = this.getControllerRouteValue(node);
        this.jwtUserProperty = this.getControllerJWTValue(node);
    }

    public IsValid() {
        return !!this.pathValue || this.pathValue === '';
    }

    public Generate(): Controller {
        if (!this.node.parent) { throw new Error('Controller node doesn\'t have a valid parent source file.'); }
        if (!this.node.name) { throw new Error('Controller node doesn\'t have a valid name.'); }

        const sourceFile = this.node.parent.getSourceFile();

        return {
            jwtUserProperty: this.jwtUserProperty || '',
            location: sourceFile.fileName,
            methods: this.buildMethods(),
            name: this.node.name.text,
            path: this.pathValue || ''
        };
    }

    private buildMethods() {
        return this.node.members
            .filter(m => m.kind === ts.SyntaxKind.MethodDeclaration)
            .map((m: ts.MethodDeclaration) => new MethodGenerator(m))
            .filter(generator => generator.IsValid())
            .map(generator => generator.Generate());
    }

    private getControllerJWTValue(node: ts.ClassDeclaration) {
        return this.getControllerDecoratorValue(node, 'JWT', 'user');
    }

    private getControllerRouteValue(node: ts.ClassDeclaration) {
        return this.getControllerDecoratorValue(node, 'Route', '');
    }

    private getControllerDecoratorValue(node: ts.ClassDeclaration, decoratorName: string, defaultValue: string) {
        if (!node.decorators) { return undefined; }

        const matchedAttributes = node.decorators
            .map(d => d.expression as ts.CallExpression)
            .filter(expression => {
                const subExpression = expression.expression as ts.Identifier;
                return subExpression.text === decoratorName;
            });

        if (!matchedAttributes.length) { return undefined; }
        if (matchedAttributes.length > 1) {
            throw new Error('A controller can only have a single "`decoratorName`" decorator.');
        }

        const value = matchedAttributes[0].arguments[0] as ts.StringLiteral;
        return value ? value.text : defaultValue;
    }

}
