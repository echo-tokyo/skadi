Учебное пособие
Пошагово создаем пример, работая вместе.
В этом уроке мы рассмотрим основные элементы интерфейса перетаскивания Pragmatic, включая перетаскиваемые объекты , области для размещения и мониторы . Чтобы понять, как эти элементы взаимодействуют друг с другом, мы создадим шахматную доску с перетаскиваемыми фигурами.

Подробную информацию об установке и ссылки для импорта см. на странице основного пакета .

Стартовый код
Вот начальный код, который мы будем использовать на протяжении всего этого руководства. Обратите внимание, что ни один из элементов нельзя перетаскивать.

Пешка
Король

Стили

Скопировать код

Редактировать в песочнице кода
/\*\*

- @jsxRuntime classic
- @jsx jsx
  \*/
  import { type ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import king from '../../icons/king.png';
import pawn from '../../icons/pawn.png';

export type Coord = [number, number];

export type PieceRecord = {
type: PieceType;
location: Coord;
};

export type PieceType = 'king' | 'pawn';

type PieceProps = {
image: string;
alt: string;
};

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
return c1[0] === c2[0] && c1[1] === c2[1];
}

export const pieceLookup: {
[Key in PieceType]: () => ReactElement;
} = {
king: () => <King />,
pawn: () => <Pawn />,
};

function renderSquares(pieces: PieceRecord[]) {
const squares = [];
for (let row = 0; row < 8; row++) {
for (let col = 0; col < 8; col++) {
const squareCoord: Coord = [row, col];

    		const piece = pieces.find((piece) => isEqualCoord(piece.location, squareCoord));

    		const isDark = (row + col) % 2 === 1;

    		squares.push(
    			<div css={squareStyles} style={{ backgroundColor: isDark ? 'lightgrey' : 'white' }}>
    				{piece && pieceLookup[piece.type]()}
    			</div>,
    		);
    	}
    }
    return squares;

}

function Chessboard(): React.JSX.Element {
const pieces: PieceRecord[] = [
{ type: 'king', location: [3, 2] },
{ type: 'pawn', location: [1, 6] },
];

    return <div css={chessboardStyles}>{renderSquares(pieces)}</div>;

}

function Piece({ image, alt }: PieceProps) {
return <img css={imageStyles} src={image} alt={alt} draggable="false" />; // draggable set to false to prevent dragging of the images
}

export function King(): React.JSX.Element {
return <Piece image={king} alt="King" />;
}

export function Pawn(): React.JSX.Element {
return <Piece image={pawn} alt="Pawn" />;
}

const chessboardStyles = css({
display: 'grid',
gridTemplateColumns: 'repeat(8, 1fr)',
gridTemplateRows: 'repeat(8, 1fr)',
width: '500px',
height: '500px',
border: '3px solid lightgrey',
});

const squareStyles = css({
width: '100%',
height: '100%',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
});

const imageStyles = css({
width: 45,
height: 45,
padding: 4,
borderRadius: 6,
boxShadow: '1px 3px 3px rgba(9, 30, 66, 0.25),0px 0px 1px rgba(9, 30, 66, 0.31)',
'&:hover': {
backgroundColor: 'rgba(168, 168, 168, 0.25)',
},
});

export default Chessboard;

Показать больше

Шаг 1: Сделайте элементы перетаскиваемыми
Первый шаг к тому, чтобы наша шахматная доска стала функциональной, — это обеспечить возможность перемещения фигур по ней.

Функция перетаскивания Pragmatic drag and drop позволяет draggableприкрепить её к элементу, чтобы активировать возможность перетаскивания. При использовании React это делается с помощью эффекта:

function Piece({ image, alt }: PieceProps) {
const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return draggable({
            element: el,
        });
    }, []);

    return <img css={imageStyles} src={image} alt={alt} ref={ref} />;

}
Теперь наш элемент ведёт себя следующим образом (попробуйте перетащить его):

Стили

Скопировать код

Редактировать в песочнице кода
Хотя теперь деталь можно перетаскивать, не возникает ощущения, что её «поднимают», поскольку она остаётся на месте во время перемещения.

Чтобы элемент плавно исчезал при перетаскивании, мы можем использовать аргументы ` onDragStartand` и `or` onDropвнутри draggableсвойства `set` для установки состояния. Затем мы можем использовать это состояние для переключения CSS внутри styleсвойства `prop`, чтобы уменьшить прозрачность.

function Piece({ image, alt }: PieceProps) {
const ref = useRef(null);
const [dragging, setDragging] = useState<boolean>(false); // NEW

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return draggable({
            element: el,
            onDragStart: () => setDragging(true), // NEW
            onDrop: () => setDragging(false), // NEW
        });
    }, []);

    return (
        <img
            css={[dragging && hidePieceStyles, imageStyles]} // toggling css using state to hide the piece
            src={image}
            alt={alt}
            ref={ref}
        />
    );

}
Теперь, когда мы его перетаскиваем, изображение как бы исчезает, создавая ощущение, будто его «поднимают». 🥳

Стили

Скопировать код

Редактировать в песочнице кода
Теперь добавим это на доску!

Стили

Скопировать код

Редактировать в песочнице кода
Чтобы ознакомиться с полной draggableдокументацией, перейдите на эту страницу .

Шаг 2: Заставить квадраты сбрасывать мишени.
Теперь, когда у нас есть перемещаемые фигуры, мы хотим, чтобы квадраты на доске служили областями, на которые можно «сбрасывать» фигуры. Для этого мы воспользуемся функцией dropTargetForElementsперетаскивания из Pragmatic.

Целевые элементы — это элементы, на которые можно перетаскивать другие элементы.

Создание мишени для сброса осуществляется по той же методике, что и для draggable. Давайте выделим клетки игрового поля, которые ранее были div, в отдельный компонент.

function Square({ location, children }: SquareProps) {
const ref = useRef(null);
const [isDraggedOver, setIsDraggedOver] = useState(false);

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            onDragEnter: () => setIsDraggedOver(true),
            onDragLeave: () => setIsDraggedOver(false),
            onDrop: () => setIsDraggedOver(false),
        });
    }, []);

    const isDark = (location[0] + location[1]) % 2 === 1;

    return (
        <div css={squareStyles} style={{ backgroundColor: getColor(isDraggedOver, isDark) }} ref={ref}>
            {children}
        </div>
    );

}
Аналогично компоненту перетаскиваемого элемента, мы устанавливаем состояние компонента в зависимости от поведения при перетаскивании.

Затем мы используем это состояние для установки цвета квадрата с помощью getColorфункции:

function getColor(isDraggedOver: boolean, isDark: boolean): string {
if (isDraggedOver) {
return 'skyblue';
}
return isDark ? 'lightgrey' : 'white';
}
Теперь квадраты подсвечиваются при наведении курсора!

Стили

Скопировать код

Редактировать в песочнице кода
Чтобы пойти еще дальше, мы можем раскрасить квадрат зеленым цветом, когда на него можно бросить фигуру, и красным, когда это невозможно.

Для этого мы сначала используем getInitialDataаргумент, draggableчтобы отобразить тип элемента и начальное местоположение перетаскиваемого элемента.

function Piece({ location, pieceType, image, alt }: PieceProps) {
const ref = useRef(null);
const [dragging, setDragging] = useState<boolean>(false);

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return draggable({
            element: el,
            getInitialData: () => ({ location, pieceType }), // NEW
            onDragStart: () => setDragging(true),
            onDrop: () => setDragging(false),
        });
    }, [location, pieceType]);

    /*...*/

}
Затем нам необходимо обработать эти данные в целевых точках сброса.

Как видно ниже, теперь область перетаскивания может получать доступ к местоположению перетаскиваемого элемента и типу фигуры, которые были отображены из draggable. Мы также ввели новую canMoveфункцию, которая определяет, может ли фигура переместиться на клетку, исходя из начального и конечного местоположения, типа фигуры и наличия уже на этой клетке фигуры.

Важно отметить, что при использовании TypeScript тип данных не переносится из объекта draggableв целевой объект для перетаскивания source. Поэтому нам необходимо вызвать функции проверки типа isCoord, isPieceTypeпрежде чем canMoveможно будет вызвать функцию.

type HoveredState = 'idle' | 'validMove' | 'invalidMove';

function Square({ pieces, location, children }: SquareProps) {
const ref = useRef(null);
const [state, setState] = useState<HoveredState>('idle');

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            onDragEnter: ({ source }) => {
                // source is the piece being dragged over the drop target
                if (
                    // type guards
                    !isCoord(source.data.location) ||
                    !isPieceType(source.data.pieceType)
                ) {
                    return;
                }

                if (canMove(source.data.location, location, source.data.pieceType, pieces)) {
                    setState('validMove');
                } else {
                    setState('invalidMove');
                }
            },
            onDragLeave: () => setState('idle'),
            onDrop: () => setState('idle'),
        });
    }, [location, pieces]);

    /*...*/

}
Затем новое состояние используется для установки цвета квадрата, как и раньше.

function getColor(state: HoveredState, isDark: boolean): string {
if (state === 'validMove') {
return 'lightgreen';
} else if (state === 'invalidMove') {
return 'pink';
}
return isDark ? 'lightgrey' : 'white';
}
В итоге, при наведении курсора на все квадраты, они теперь подсвечиваются, если ход действителен.

Стили

Скопировать код

Редактировать в песочнице кода
Мы также можем использовать данные, которые мы прикрепили к перетаскиваемому объекту, чтобы предотвратить взаимодействие с квадратом, из которого он перетаскивается. Для этого используется canDropаргумент dropTargetForElements.

return dropTargetForElements({
element: el,
canDrop: ({ source }) => {
// NEW
if (!isCoord(source.data.location)) {
return false;
}

        return !isEqualCoord(source.data.location, location);
    },
    // ...the rest of our dropTargetForElements arguments

});
Теперь мы видим, что квадрат, в котором находится фигура, не меняет цвет при наведении курсора и на который нельзя перетащить курсор. Это работает за счет отключения функции выбора места для перетаскивания при canDropвозврате значения false.

Стили

Скопировать код

Редактировать в песочнице кода
Полную документацию по мишеням для сброса смотрите на этой странице .

Шаг 3: Перемещение фигур
Наконец, давайте позволим фигурам перемещаться на клетки при сбросе. Для этого мы воспользуемся функцией monitorForElementsперетаскивания из Pragmatic.

Мониторы позволяют отслеживать взаимодействие перетаскивания из любой точки вашего кода. Это позволяет им получать данные о целевой области для перетаскивания и выполнять операции без необходимости передачи состояния от компонентов.

Таким образом, мы можем разместить монитор на useEffectверхнем уровне шахматной доски и следить за тем, когда фигуры размещаются на клетках.

Для этого нам сначала нужно отобразить местоположение квадратов внутри целевой области, как мы это сделали для перетаскиваемых элементов на предыдущем шаге:

function Square({ pieces, location, children }: SquareProps) {
const ref = useRef(null);
const [state, setState] = useState<HoveredState>('idle');

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return dropTargetForElements({
            element: el,
            getData: () => ({ location }), // NEW

            /*...*/
        });
    });

    /*...*/

}
Затем мы добавляем монитор на шахматную доску. Большая часть этой логики повторяет логику, описанную выше для раскрашивания клеток.

function Chessboard() {
const [pieces, setPieces] = useState<PieceRecord[]>([
{ type: 'king', location: [3, 2] },
{ type: 'pawn', location: [1, 6] },
]);

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const destination = location.current.dropTargets[0];
                if (!destination) {
                    // if dropped outside of any drop targets
                    return;
                }
                const destinationLocation = destination.data.location;
                const sourceLocation = source.data.location;
                const pieceType = source.data.pieceType;

                if (
                    // type guarding
                    !isCoord(destinationLocation) ||
                    !isCoord(sourceLocation) ||
                    !isPieceType(pieceType)
                ) {
                    return;
                }

                const piece = pieces.find((p) => isEqualCoord(p.location, sourceLocation));
                const restOfPieces = pieces.filter((p) => p !== piece);

                if (
                    canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
                    piece !== undefined
                ) {
                    // moving the piece!
                    setPieces([{ type: piece.type, location: destinationLocation }, ...restOfPieces]);
                }
            },
        });
    }, [pieces]);

    /*...*/

}
И вуаля! Теперь у нас есть шахматная доска с подвижными фигурами. Попробуйте перетащить фигуры.

Вы также можете просмотреть код, чтобы получить более подробную информацию о типизации, защите типов и других деталях, которые мы кратко упомянули в тексте.

Стили

Скопировать код

Редактировать в песочнице кода
/\*\*

- @jsxRuntime classic
- @jsx jsx
  \*/
  import { type ReactElement, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { King, Pawn } from './draggable-piece-with-data';
import Square from './square-with-data';

export type Coord = [number, number];

export type PieceRecord = {
type: PieceType;
location: Coord;
};

export type PieceType = 'king' | 'pawn';

export function isCoord(token: unknown): token is Coord {
return (
Array.isArray(token) && token.length === 2 && token.every((val) => typeof val === 'number')
);
}

const pieceTypes: PieceType[] = ['king', 'pawn'];

export function isPieceType(value: unknown): value is PieceType {
return typeof value === 'string' && pieceTypes.includes(value as PieceType);
}

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
return c1[0] === c2[0] && c1[1] === c2[1];
}

export const pieceLookup: {
[Key in PieceType]: (location: [number, number]) => ReactElement;
} = {
king: (location) => <King location={location} />,
pawn: (location) => <Pawn location={location} />,
};

export function canMove(
start: Coord,
destination: Coord,
pieceType: PieceType,
pieces: PieceRecord[],
): boolean {
const rowDist = Math.abs(start[0] - destination[0]);
const colDist = Math.abs(start[1] - destination[1]);

    if (pieces.find((piece) => isEqualCoord(piece.location, destination))) {
    	return false;
    }

    switch (pieceType) {
    	case 'king':
    		return [0, 1].includes(rowDist) && [0, 1].includes(colDist);
    	case 'pawn':
    		return colDist === 0 && start[0] - destination[0] === -1;
    	default:
    		return false;
    }

}

function renderSquares(pieces: PieceRecord[]) {
const squares = [];
for (let row = 0; row < 8; row++) {
for (let col = 0; col < 8; col++) {
const squareCoord: Coord = [row, col];

    		const piece = pieces.find((piece) => isEqualCoord(piece.location, squareCoord));

    		squares.push(
    			<Square pieces={pieces} location={squareCoord}>
    				{piece && pieceLookup[piece.type](squareCoord)}
    			</Square>,
    		);
    	}
    }
    return squares;

}

function Chessboard(): React.JSX.Element {
const [pieces, setPieces] = useState<PieceRecord[]>([
{ type: 'king', location: [3, 2] },
{ type: 'pawn', location: [1, 6] },
]);

    useEffect(() => {
    	return monitorForElements({
    		onDrop({ source, location }) {
    			const destination = location.current.dropTargets[0];
    			if (!destination) {
    				return;
    			}
    			const destinationLocation = destination.data.location;
    			const sourceLocation = source.data.location;
    			const pieceType = source.data.pieceType;

    			if (!isCoord(destinationLocation) || !isCoord(sourceLocation) || !isPieceType(pieceType)) {
    				return;
    			}

    			const piece = pieces.find((p) => isEqualCoord(p.location, sourceLocation));
    			const restOfPieces = pieces.filter((p) => p !== piece);

    			if (
    				canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
    				piece !== undefined
    			) {
    				setPieces([{ type: piece.type, location: destinationLocation }, ...restOfPieces]);
    			}
    		},
    	});
    }, [pieces]);

    return <div css={chessboardStyles}>{renderSquares(pieces)}</div>;

}

const chessboardStyles = css({
display: 'grid',
gridTemplateColumns: 'repeat(8, 1fr)',
gridTemplateRows: 'repeat(8, 1fr)',
width: '500px',
height: '500px',
border: '3px solid lightgrey',
});

export default Chessboard;

Show less
Полную документацию по мониторам вы найдете на нашей странице , посвященной мониторам.

Теперь ваша очередь.
Теперь вы готовы начать создавать собственные проекты с помощью функции перетаскивания Pragmatic.

Дополнительные примеры смотрите на нашей странице с примерами , а информацию о том, как перетаскивать файлы с помощью функции перетаскивания Pragmatic, см. на нашей странице с внешним адаптером .
