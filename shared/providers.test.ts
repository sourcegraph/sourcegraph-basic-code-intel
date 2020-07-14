import { createStubTextDocument } from '@sourcegraph/extension-api-stubs'
import * as assert from 'assert'
import { Observable } from 'rxjs'
import * as sourcegraph from 'sourcegraph'
import { impreciseBadge } from './badges'
import {
    createDefinitionProvider,
    createHoverProvider,
    createReferencesProvider,
    createDocumentHighlightProvider,
} from './providers'

const doc = createStubTextDocument({
    uri: 'https://sourcegraph.test/repo@rev/-/raw/foo.ts',
    languageId: 'typescript',
    text: undefined,
})

const pos = new sourcegraph.Position(10, 5)
const range1 = new sourcegraph.Range(1, 2, 3, 4)
const range2 = new sourcegraph.Range(5, 6, 7, 8)

const loc1 = new sourcegraph.Location(new URL('http://test/1'), range1)
const loc2 = new sourcegraph.Location(new URL('http://test/2'), range1)
const loc3 = new sourcegraph.Location(new URL('http://test/3'), range1)
const loc4 = new sourcegraph.Location(new URL('http://test/4'), range1)
const loc5 = new sourcegraph.Location(new URL('http://test/2'), range2) // overlapping URI
const loc6 = new sourcegraph.Location(new URL('http://test/3'), range2) // overlapping URI
const loc7 = new sourcegraph.Location(new URL('http://test/4'), range2) // overlapping URI

const hover1: sourcegraph.Hover = { contents: { value: 'test1' } }
const hover2: sourcegraph.Hover = { contents: { value: 'test2' } }
const hover3: sourcegraph.Hover = { contents: { value: 'test3' } }

describe('createDefinitionProvider', () => {
    it('uses LSIF definitions as source of truth', async () => {
        const result = createDefinitionProvider(
            () => asyncGeneratorFromValues([loc1, loc2]),
            () => asyncGeneratorFromValues([loc3])
        ).provideDefinition(doc, pos) as Observable<sourcegraph.Definition>

        assert.deepStrictEqual(await gatherValues(result), [loc1, loc2])
    })

    it('falls back to basic when precise results are not found', async () => {
        const result = createDefinitionProvider(
            () => asyncGeneratorFromValues([]),
            () => asyncGeneratorFromValues([loc3])
        ).provideDefinition(doc, pos) as Observable<sourcegraph.Definition>

        assert.deepStrictEqual(await gatherValues(result), [{ ...loc3, badge: impreciseBadge }])
    })
})

describe('createReferencesProvider', () => {
    it('uses LSIF definitions as source of truth', async () => {
        const result = createReferencesProvider(
            () =>
                asyncGeneratorFromValues([
                    [loc1, loc2],
                    [loc1, loc2, loc3],
                ]),
            () => asyncGeneratorFromValues([])
        ).provideReferences(doc, pos, {
            includeDeclaration: false,
        }) as Observable<sourcegraph.Badged<sourcegraph.Location>[]>

        assert.deepStrictEqual(await gatherValues(result), [
            [loc1, loc2],
            [loc1, loc2, loc3],
        ])
    })

    it('supplements LSIF results with search results', async () => {
        const result = createReferencesProvider(
            () =>
                asyncGeneratorFromValues([
                    [loc1, loc2],
                    [loc1, loc2, loc3],
                ]),
            () => asyncGeneratorFromValues([[loc4]])
        ).provideReferences(doc, pos, {
            includeDeclaration: false,
        }) as Observable<sourcegraph.Badged<sourcegraph.Location>[]>

        assert.deepStrictEqual(await gatherValues(result), [
            [loc1, loc2],
            [loc1, loc2, loc3],
            [loc1, loc2, loc3, { ...loc4, badge: impreciseBadge }],
        ])
    })

    it('supplements LSIF results with non-overlapping search results', async () => {
        const result = createReferencesProvider(
            () =>
                asyncGeneratorFromValues([
                    [loc1, loc2],
                    [loc1, loc2, loc3],
                ]),
            () => asyncGeneratorFromValues([[loc4], [loc4, loc5, loc6, loc7]])
        ).provideReferences(doc, pos, {
            includeDeclaration: false,
        }) as Observable<sourcegraph.Badged<sourcegraph.Location>[]>

        assert.deepStrictEqual(await gatherValues(result), [
            [loc1, loc2],
            [loc1, loc2, loc3],
            [loc1, loc2, loc3, { ...loc4, badge: impreciseBadge }],
            [loc1, loc2, loc3, { ...loc4, badge: impreciseBadge }, { ...loc7, badge: impreciseBadge }],
        ])
    })
})

describe('createHoverProvider', () => {
    it('uses LSIF definitions as source of truth', async () => {
        const result = createHoverProvider(
            () => asyncGeneratorFromValues([hover1, hover2]),
            () => asyncGeneratorFromValues([hover3])
        ).provideHover(doc, pos) as Observable<sourcegraph.Badged<sourcegraph.Hover>>

        assert.deepStrictEqual(await gatherValues(result), [hover1, hover2])
    })

    it('falls back to basic when precise results are not found', async () => {
        const result = createHoverProvider(
            () => asyncGeneratorFromValues([]),
            () => asyncGeneratorFromValues([hover3])
        ).provideHover(doc, pos) as Observable<sourcegraph.Badged<sourcegraph.Hover>>

        assert.deepStrictEqual(await gatherValues(result), [{ ...hover3, badge: impreciseBadge }])
    })
})

describe('createDocumentHighlightProvider', () => {
    it('uses LSIF document highlights', async () => {
        const result = createDocumentHighlightProvider(() =>
            asyncGeneratorFromValues([[{ range: range1 }, { range: range2 }]])
        ).provideDocumentHighlights(doc, pos) as Observable<sourcegraph.DocumentHighlight[]>

        assert.deepStrictEqual(await gatherValues(result), [[{ range: range1 }, { range: range2 }]])
    })
})

async function* asyncGeneratorFromValues<P>(source: P[]): AsyncGenerator<P, void, undefined> {
    await Promise.resolve()

    for (const value of source) {
        yield value
    }
}

async function gatherValues<T>(o: Observable<T>): Promise<T[]> {
    const values: T[] = []
    await new Promise(complete => o.subscribe({ next: v => values.push(v), complete }))
    return values
}
