import path from 'node:path';
import * as ts from 'typescript';
import { describe, expect, it } from 'vitest';

describe('verbatimModuleSyntax compatibility', () => {
	it('lib/types.ts has no type-only export violations (TS1448/TS1484)', () => {
		const fileName = path.join(__dirname, '..', 'lib', 'types.ts');
		const program = ts.createProgram([fileName], {
			verbatimModuleSyntax: true,
			noEmit: true,
			skipLibCheck: true,
			module: ts.ModuleKind.ESNext,
			moduleResolution: ts.ModuleResolutionKind.Bundler,
			target: ts.ScriptTarget.ESNext,
		});
		const sourceFile = program.getSourceFile(fileName)!;
		const diagnostics = [
			...program.getSyntacticDiagnostics(sourceFile),
			...program.getSemanticDiagnostics(sourceFile),
		].filter(d => d.code === 1448 || d.code === 1484);

		expect(
			diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')),
		).toEqual([]);
	});
});
