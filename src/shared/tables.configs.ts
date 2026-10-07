
export const NAME_COL = 'имя';
export const COMMAND_COL = 'команда';
// Место колонок трасс в конфиге боулдеринга: withRouteColumns разворачивает его в r1..rN по протоколу
export const ROUTES_PROP = 'r1';

export const leadQualConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: 'ст.#', prop: 'stRank' },
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: 'результат', prop: 'score' },
].map((item, i) => ({ ...item, id: `lq-${i}` }));

export const leadQualResultsConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: 'тр.1', prop: 'score1' },
    { name: 'балл', prop: 'mark1' },
    { name: 'тр.2', prop: 'score2' },
    { name: 'балл', prop: 'mark2' },
    { name: 'баллы', prop: 'mark' },
].map((item, i) => ({ ...item, id: `lqr-${i}` }));

export const leadFinalConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: 'ст.#', prop: 'stRank' },
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: 'кв.свод', prop: 'qRank' },
    { name: 'результат', prop: 'score' },
].map((item, i) => ({ ...item, id: `lqf-${i}` }));

export const boulderQualConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: 'ст.#', prop: 'stRank' },
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: '1', prop: ROUTES_PROP },
    { name: 'результат', prop: 'score' },
].map((item, i) => ({ ...item, id: `bq-${i}` }));

export const boulderFinalConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: 'ст.#', prop: 'stRank' },
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: 'квал', prop: 'qRank' },
    { name: '1', prop: ROUTES_PROP },
    { name: 'результат', prop: 'score' },
].map((item, i) => ({ ...item, id: `bf-${i}` }));

export const speedQualConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: 'ст.#', prop: 'stRank' },
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: 'тр.1', prop: 'score1' },
    { name: 'ст.#2', prop: 'stRank2' },
    { name: 'тр.2', prop: 'score2' },
    { name: 'результат', prop: 'score' },
].map((item, i) => ({ ...item, id: `sq-${i}` }));

// Классическая скорость: сумма двух трасс, второго стартового номера нет. Таблица показывает те же колонки, что и обычная скорость
export const speedClassicQualConfig = [
    { name: 'место', prop: 'rank' },
    {},
    { name: 'ст.#', prop: 'stRank' },
    { name: NAME_COL, prop: 'name' },
    { name: COMMAND_COL, prop: 'command' },
    { name: 'тр.1', prop: 'score1' },
    { name: 'тр.2', prop: 'score2' },
    { name: 'результат', prop: 'score' },
].map((item, i) => ({ ...item, id: `scq-${i}` }));
