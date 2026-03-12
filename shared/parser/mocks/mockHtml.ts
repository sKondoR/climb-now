import { parseFragment } from '../parsers'

export const mockHtmlWith404 = `
    <!DOCTYPE html>
    <html>
        <head><title>404 Not Found</title></head>
        <body>
            <h1>404 Not Found</h1>
        </body>
    </html>
`

export const mockHtmlLeadQual = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ЛАЗАНИЕ НА ТРУДНОСТЬ - Квалификация</title>
    </head>
    <body>
    <div id="title">
        <h3>ВЮС Приз памяти Владимира Маламида 2026</h3>
        <h1>Девушки 13-14 лет - ЛАЗАНИЕ НА ТРУДНОСТЬ - Квалификация (трасса 1)</h1>
    </div>
    <table>
    <thead>
        <tr>
            <th rowspan="2">Место</th>
            <th rowspan="2">ИН</th>
            <th rowspan="2">Ст. N</th>
            <th rowspan="2">Фамилия, имя</th>
            <th rowspan="2">Команда</th>
            <th>Результат</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="rank">1</td>
            <td class="id">116</td>
            <td class="st">19</td>
            <td class="name">Татищева Ксения</td>
            <td class="command">КЛНД</td>
            <td class="res">31+</td>
        </tr>
        <tr>
            <td class="rank">2</td>
            <td class="id">483</td>
            <td class="st">18</td>
            <td class="name">Зырянова Станислава</td>
            <td class="command">СПБ</td>
            <td class="res">30+</td>
        </tr>
        <tr>
            <td class="rank">2</td>
            <td class="id">245</td>
            <td class="st">53</td>
            <td class="name">Евдокимова Елена</td>
            <td class="command">МСК</td>
            <td class="res">30+</td>
        </tr>
    </tbody>
    </table>
    </body>
</html>
`
export const mockParsedLeadQual = parseFragment(mockHtmlLeadQual)

export const mockHtmlLeadQualResults = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ЛАЗАНИЕ НА ТРУДНОСТЬ - Квалификация сводный</title>
    </head>
    <body>
    <div id="title">
        <h3>ВЮС Приз памяти Владимира Маламида 2026</h3>
        <h1>Девушки 13-14 лет - ЛАЗАНИЕ НА ТРУДНОСТЬ - Квалификация сводный</h1>
    </div>
    <table>
        <thead>
            <tr>
                <th rowspan="2">Место</th>
                <th rowspan="2">ИН</th>
                <th rowspan="2">Фамилия, имя</th>
                <th rowspan="2">Команда</th>
                <th colspan="5">Квалификация</th>
            </tr>
            <tr>
                <th>Тр. 1</th>
                <th>Балл</th>
                <th>Тр. 2</th>
                <th>Балл</th>
                <th>Баллы</th>
            </tr>
        </thead>
    <tbody>
    <tr class="q">
        <td class="rank">1</td>
        <td class="id">116</td>
        <td class="name">Татищева Ксения</td>
        <td class="command">КЛНД</td>
        <td class="res">31+</td>
        <td class="res">1</td>
        <td class="res">27+</td>
        <td class="res">5</td>
        <td class="res">2,24</td>
    </tr>
    <tr class="q">
        <td class="rank">1</td>
        <td class="id">245</td>
        <td class="name">Евдокимова Елена</td>
        <td class="command">МСК</td>
        <td class="res">30+</td>
        <td class="res">2,5</td>
        <td class="res">31+</td>
        <td class="res">2</td>
        <td class="res">2,24</td>
    </tr>
    <tr class="q">
        <td class="rank">3</td>
        <td class="id">57</td>
        <td class="name">Доброва Ксения</td>
        <td class="command">ВРНЖ</td>
        <td class="res">25+</td>
        <td class="res">7</td>
        <td class="res">34</td>
        <td class="res">1</td>
        <td class="res">2,65</td>
    </tr>
    </tbody>
    </table>
    </body>
</html>
`
export const mockParsedLeadQualResults = parseFragment(mockHtmlLeadQualResults)

export const mockHtmlLeadFinal = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>ЛАЗАНИЕ НА ТРУДНОСТЬ - Финал</title>
    </head>
    <body>
    <div id="title">
        <h3>ВЮС Приз памяти Владимира Маламида 2026</h3>
        <h1>Девушки 13-14 лет - ЛАЗАНИЕ НА ТРУДНОСТЬ - Финал</h1>
    </div>
    <table>
    <thead>
        <tr>
            <th rowspan="2">Место</th>
            <th rowspan="2">ИН</th>
            <th rowspan="2">Ст. N</th>
            <th rowspan="2">Фамилия, имя</th>
            <th rowspan="2">Команда</th>
            <th>кв. свод.</th>
            <th>Результат</th>
        </tr>
    </thead>
    <tbody>
        <tr class="q">
            <td class="rank">1</td>
            <td class="id">57</td>
            <td class="st">8</td>
            <td class="name">Доброва Ксения</td>
            <td class="command">ВРНЖ</td>
            <td class="pre">3</td>
            <td class="res">29+</td>
        </tr>
        <tr class="q">
            <td class="rank">2</td>
            <td class="id">483</td>
            <td class="st">5</td>
            <td class="name">Зырянова Станислава</td>
            <td class="command">СПБ</td>
            <td class="pre">6</td>
            <td class="res">29+</td>
        </tr>
        <tr class="q">
            <td class="rank">3</td>
            <td class="id">245</td>
            <td class="st">10</td>
            <td class="name">Евдокимова Елена</td>
            <td class="command">МСК</td>
            <td class="pre">1</td>
            <td class="res">28+</td>
        </tr>
    </tbody>
    </table>
    </body>
</html>
`
export const mockParsedLeadFinal = parseFragment(mockHtmlLeadFinal)

export const mockHtmlBoulderQual = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>БОУЛДЕРИНГ - Квалификация</title>
    </head>
    <body>
    <div id="title">
        <h3>ВЮС Приз памяти Владимира Маламида 2026</h3>
        <h1>Юноши 13-14 лет - БОУЛДЕРИНГ - Квалификация</h1>
    </div>
    <table>
    <thead>
        <tr>
            <th>место</th>
            <th></th>
            <th>ст #</th>
            <th></th>
            <th></th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>Результат</th>
        </tr>
    </thead>
    <tbody>
    <tr class="q">
        <td class="rank">1</td>
        <td class="id">117</td>
        <td class="st">1</td>
        <td class="name">Боровков Арсений</td>
        <td class="command">КЛНД</td>
        <td class="route"><div class="r_2">2<br>2</div></td>
        <td class="route"><div class="r_2">2<br>2</div></td>
        <td class="route"><div class="r_1"><br>1</div></td>
        <td class="route"><div class="r_2">1<br>1</div></td>
        <td class="route"><div class="r_2">1<br>1</div></td>
        <td class="route_sum route-border-left">109,8</td>
    </tr>
    <tr class="q">
        <td class="rank">2</td>
        <td class="id">543</td>
        <td class="st">2</td>
        <td class="name">Шулев Гавриил</td>
        <td class="command">СВРД</td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">1<br>1</div></td>
        <!-- td class="route"><div class="r_0">&nbsp;</div></td -->
        <td class="route"><div class="r_0"><br></div></td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">1<br>1</div></td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">1<br>1</div></td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">6<br>6</div></td>
        <td class="route_sum route-border-left">99,5</td>
    </tr>
    <tr class="q">
        <td class="rank">3</td>
        <td class="id">582</td>
        <td class="st">18</td>
        <td class="name">Асташкин Елисей</td>
        <td class="command">ТЮМН</td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">2<br>1</div></td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">6<br>3</div></td>
        <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
        <td class="route"><div class="r_1"><br>2</div></td>
        <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
        <td class="route"><div class="r_2">1<br>1</div></td>
        <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
        <td class="route"><div class="r_1"><br>1</div></td>
        <td class="route_sum route-border-left">94,3</td>
    </tr>
    </tbody>
    </table>
    </body>
</html>
`
export const mockParsedBoulderQual = parseFragment(mockHtmlBoulderQual)

export const mockHtmlBoulderFinal = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>БОУЛДЕРИНГ - Финал</title>
    </head>
    <body>
    <div id="title">
        <h3>ВЮС Приз памяти Владимира Маламида 2026</h3>
        <h1>Юноши 13-14 лет - БОУЛДЕРИНГ - Финал</h1>
    </div>
    <table>
    <thead>
        <tr>
            <th>место</th>
            <th></th>
            <th>ст #</th>
            <th></th>
            <th></th>
            <th>квал.</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>Результат</th>
        </tr>
    </thead>
    <tbody>
       <tr class="q">
            <td class="rank">1</td>
            <td class="id">174</td>
            <td class="st">9</td>
            <td class="name">Нагорничных Яромир</td>
            <td class="command">ЛЕНГ</td>
            <td class="pre">4</td>
            <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
            <td class="route"><div class="r_2">4<br>4</div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>2</div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>1</div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>1</div></td>
            <td class="route_sum route-border-left">54,6</td>
        </tr>
        <tr class="q">
            <td class="rank">2</td>
            <td class="id">117</td>
            <td class="st">12</td>
            <td class="name">Боровков Арсений</td>
            <td class="command">КЛНД</td>
            <td class="pre">1</td>
            <!-- td class="route"><div class="r_0">&nbsp;</div></td -->
            <td class="route"><div class="r_0"><br></div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>7</div></td>
            <!-- td class="route"><div class="r_2">&nbsp;</div></td -->
            <td class="route"><div class="r_2">4<br>1</div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>1</div></td>
            <td class="route_sum route-border-left">44,1</td>
        </tr>
        <tr class="q">
            <td class="rank">3</td>
            <td class="id">173</td>
            <td class="st">1</td>
            <td class="name">Ганичев Максим</td>
            <td class="command">ЛЕНГ</td>
            <td class="pre">12</td>
            <!-- td class="route"><div class="r_0">&nbsp;</div></td -->
            <td class="route"><div class="r_0"><br></div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>8</div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>1</div></td>
            <!-- td class="route"><div class="r_1">&nbsp;</div></td -->
            <td class="route"><div class="r_1"><br>1</div></td>
            <td class="route_sum route-border-left">29,3</td>
        </tr>
    </tbody>
    </table>
    </body>
</html>
`
export const mockParsedBoulderFinal = parseFragment(mockHtmlBoulderFinal)
