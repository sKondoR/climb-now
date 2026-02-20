
export const NAME_COL = 'имя';

export const leadQualConfig = [
    { name: 'место', prop: 'rank', parserId: 0 },
    { name: 'ст.#', prop: 'stRank', parserId: 2 },
    { name: NAME_COL, prop: 'name', parserId: 3 },
    { name: 'команда', prop: 'command', parserId: 4 },
    { name: 'результат', prop: 'score', parserId: 5 },
].map((item, i) => ({ ...item, id: `lq-${i}` }));

export const leadQualResultsConfig = [
    { name: 'место', prop: 'rank', parserId: 0 },
    { name: NAME_COL, prop: 'name', parserId: 2 },
    { name: 'команда', prop: 'command', parserId: 3 },
    { name: 'тр.1', prop: 'score1', parserId: 4 },
    { name: 'балл', prop: 'mark1', parserId: 5 },
    { name: 'тр.2', prop: 'score2', parserId: 6 },
    { name: 'балл', prop: 'mark2', parserId: 7 },
    { name: 'баллы', prop: 'mark', parserId: 8 },
].map((item, i) => ({ ...item, id: `lqr-${i}` }));

export const leadFinalsConfig = [
    { name: 'место', prop: 'rank', parserId: 0 },
    { name: 'ст.#', prop: 'stRank', parserId: 2 },
    { name: NAME_COL, prop: 'name', parserId: 3 },
    { name: 'команда', prop: 'command', parserId: 4 },
    { name: 'кв.свод', prop: 'qRank', parserId: 5 },
    { name: 'результат', prop: 'score', parserId: 6 },
].map((item, i) => ({ ...item, id: `lqf-${i}` }));

export const boulderQualConfig = [
    { name: 'место', prop: 'rank', parserId: 0 },
    { name: 'ст.#', prop: 'stRank', parserId: 2 },
    { name: NAME_COL, prop: 'name', parserId: 3 },
    { name: 'команда', prop: 'command', parserId: 4 },
    { name: '1', prop: 'r1', parserId: 5 },
    { name: '2', prop: 'r2', parserId: 6 },
    { name: '3', prop: 'r3', parserId: 7 },
    { name: '4', prop: 'r4', parserId: 8 },
    { name: '5', prop: 'r5', parserId: 9 },
    { name: 'результат', prop: 'score', parserId: 10 },
].map((item, i) => ({ ...item, id: `bq-${i}` }));

export const boulderFinalsConfig = [
    { name: 'место', prop: 'rank', parserId: 0 },
    { name: 'ст.#', prop: 'stRank', parserId: 2 },
    { name: NAME_COL, prop: 'name', parserId: 3 },
    { name: 'команда', prop: 'command', parserId: 4 },
    { name: '1', prop: 'r1', parserId: 5 },
    { name: '2', prop: 'r2', parserId: 6 },
    { name: '3', prop: 'r3', parserId: 7 },
    { name: '4', prop: 'r4', parserId: 8 },
    { name: 'результат', prop: 'score', parserId: 9 },
].map((item, i) => ({ ...item, id: `bf-${i}` }));
