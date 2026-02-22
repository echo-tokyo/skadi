import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useId,
  useEffect,
  memo,
  type ReactNode,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import { getUIClasses } from '@/shared/lib/classNames'
import { ChevronDown, Check } from '@/shared/ui/icons'
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'

// TODO: порефакторить этот нейрокал

export interface SelectOption<T extends string = string> {
  label: string
  value: T
  disabled?: boolean
}

interface BaseProps<T extends string = string> {
  options: SelectOption<T>[]
  placeholder?: string
  label?: string
  disabled?: boolean
  fluid?: boolean
  size?: 's' | 'm'
  selectedCountLabel?: string
  /** Включить поиск по опциям */
  searchable?: boolean
  /** Placeholder для поля поиска */
  searchPlaceholder?: string
  /** Текст когда ничего не найдено */
  noResultsText?: string
}

interface SingleProps<T extends string = string>
  extends BaseProps<T> {
  multiple?: false
  value: T | ''
  onChange: (value: T | '') => void
}

interface MultipleProps<T extends string = string>
  extends BaseProps<T> {
  multiple: true
  value: T[]
  onChange: (value: T[]) => void
}

export type SelectProps<T extends string = string> =
  | SingleProps<T>
  | MultipleProps<T>

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

interface SelectItemProps {
  label: string
  selected: boolean
  disabled?: boolean
  highlighted: boolean
  onSelect: () => void
  onMouseEnter: () => void
}

const SelectItem = memo(
  ({
    label,
    selected,
    disabled,
    highlighted,
    onSelect,
    onMouseEnter,
  }: SelectItemProps): ReactNode => (
    <div
      role='option'
      aria-selected={selected}
      aria-disabled={disabled}
      data-highlighted={highlighted || undefined}
      data-disabled={disabled || undefined}
      className={clsx(styles.item, selected && styles.item_checked)}
      onClick={disabled ? undefined : onSelect}
      onMouseEnter={onMouseEnter}
    >
      <span className={styles.check_indicator}>
        {selected && <Check />}
      </span>
      {label}
    </div>
  ),
)
SelectItem.displayName = 'SelectItem'

// ---------------------------------------------------------------------------
// useSelectKeyboard — хук для клавиатурной навигации
// ---------------------------------------------------------------------------

interface UseSelectKeyboardProps {
  options: SelectOption[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  onSelect: (value: string) => void
  onClose: () => void
}

const useSelectKeyboard = ({
  options,
  highlightedIndex,
  setHighlightedIndex,
  onSelect,
  onClose,
}: UseSelectKeyboardProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const enabledIndices = options
        .map((o, i) => (!o.disabled ? i : -1))
        .filter((i) => i !== -1)

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          const currentPos = enabledIndices.indexOf(highlightedIndex)
          const nextPos = Math.min(
            currentPos + 1,
            enabledIndices.length - 1,
          )
          setHighlightedIndex(enabledIndices[nextPos] ?? 0)
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const currentPos = enabledIndices.indexOf(highlightedIndex)
          const prevPos = Math.max(currentPos - 1, 0)
          setHighlightedIndex(enabledIndices[prevPos] ?? 0)
          break
        }
        case 'Home': {
          e.preventDefault()
          if (enabledIndices.length > 0) {
            setHighlightedIndex(enabledIndices[0])
          }
          break
        }
        case 'End': {
          e.preventDefault()
          if (enabledIndices.length > 0) {
            setHighlightedIndex(
              enabledIndices[enabledIndices.length - 1],
            )
          }
          break
        }
        case 'Enter': {
          e.preventDefault()
          const option = options[highlightedIndex]
          if (option && !option.disabled) {
            onSelect(option.value)
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          onClose()
          break
        }
      }
    },
    [
      options,
      highlightedIndex,
      setHighlightedIndex,
      onSelect,
      onClose,
    ],
  )

  return { handleKeyDown }
}

// ---------------------------------------------------------------------------
// SelectContent — общий контент для single и multi режимов
// ---------------------------------------------------------------------------

interface SelectContentProps<T extends string> {
  options: SelectOption<T>[]
  isSelected: (value: T) => boolean
  onSelect: (value: T) => void
  listboxId: string
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
  onSearchChange?: (query: string) => void
}

const SelectContent = <T extends string>({
  options,
  isSelected,
  onSelect,
  listboxId,
  searchable,
  searchPlaceholder = 'Поиск...',
  noResultsText = 'Ничего не найдено',
  onSearchChange,
}: SelectContentProps<T>): ReactNode => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Фильтрация опций
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options
    const query = searchQuery.toLowerCase()
    return options.filter((o) =>
      o.label.toLowerCase().includes(query),
    )
  }, [options, searchQuery])

  // Инициализация highlighted на выбранном элементе (или 0)
  const [highlightedIndex, setHighlightedIndex] = useState(() => {
    const idx = options.findIndex((o) => isSelected(o.value))
    return idx >= 0 ? idx : 0
  })

  // Сброс highlighted только при изменении поискового запроса
  useEffect(() => {
    if (searchQuery) {
      setHighlightedIndex(0)
    }
  }, [searchQuery])

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      onSearchChange?.(value)
    },
    [onSearchChange],
  )

  const { handleKeyDown } = useSelectKeyboard({
    options: filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    onSelect: (value) => onSelect(value as T),
    onClose: () => {
      // Popover закроется автоматически при Escape
    },
  })

  // Обработка клавиш в поле поиска
  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        handleKeyDown(e as unknown as KeyboardEvent)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const option = filteredOptions[highlightedIndex]
        if (option && !option.disabled) {
          onSelect(option.value)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        // Сбросить поиск и закрыть
        setSearchQuery('')
      }
    },
    [handleKeyDown, filteredOptions, highlightedIndex, onSelect],
  )

  return (
    <div className={styles.content_inner}>
      {searchable && (
        <div className={styles.search_wrapper}>
          <input
            ref={searchInputRef}
            type='text'
            className={styles.search_input}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            autoFocus
          />
        </div>
      )}
      <div
        ref={listRef}
        role='listbox'
        id={listboxId}
        className={styles.viewport}
        tabIndex={searchable ? -1 : 0}
        onKeyDown={searchable ? undefined : handleKeyDown}
      >
        {filteredOptions.length === 0 ? (
          <div className={styles.no_results}>{noResultsText}</div>
        ) : (
          filteredOptions.map((option, index) => (
            <SelectItem
              key={option.value}
              label={option.label}
              selected={isSelected(option.value)}
              disabled={option.disabled}
              highlighted={index === highlightedIndex}
              onSelect={() => onSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SingleSelect
// ---------------------------------------------------------------------------

interface SingleSelectInternalProps<T extends string>
  extends SingleProps<T> {
  wrapperClassName: string
  triggerClassName: string
}

const SingleSelect = <T extends string>({
  options,
  label,
  placeholder,
  disabled,
  value,
  onChange,
  wrapperClassName,
  triggerClassName,
  searchable,
  searchPlaceholder,
  noResultsText,
}: SingleSelectInternalProps<T>): ReactNode => {
  const [open, setOpen] = useState(false)
  const triggerId = useId()
  const listboxId = useId()

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label,
    [options, value],
  )

  const handleSelect = useCallback(
    (optionValue: T): void => {
      // Toggle: клик на выбранный — сбрасываем, иначе выбираем
      onChange(value === optionValue ? '' : optionValue)
      setOpen(false)
    },
    [value, onChange],
  )

  const isSelected = useCallback((v: T) => v === value, [value])

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={triggerId} className={styles.label}>
          {label}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          id={triggerId}
          className={triggerClassName}
          disabled={disabled}
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-controls={listboxId}
        >
          <span
            className={selectedLabel ? undefined : styles.placeholder}
          >
            {selectedLabel ?? placeholder}
          </span>
          <span className={styles.icon}>
            <ChevronDown />
          </span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={styles.content}
            style={{ width: 'var(--radix-popover-trigger-width)' }}
            sideOffset={4}
            align='start'
            onOpenAutoFocus={(e) => {
              // Если searchable — фокус на input, иначе на listbox
              if (!searchable) {
                e.preventDefault()
                const listbox = document.getElementById(listboxId)
                listbox?.focus()
              }
            }}
          >
            <SelectContent
              options={options}
              isSelected={isSelected}
              onSelect={handleSelect}
              listboxId={listboxId}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              noResultsText={noResultsText}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MultiSelect
// ---------------------------------------------------------------------------

interface MultiSelectInternalProps<T extends string>
  extends MultipleProps<T> {
  wrapperClassName: string
  triggerClassName: string
}

const MultiSelect = <T extends string>({
  options,
  label,
  placeholder,
  disabled,
  value,
  onChange,
  wrapperClassName,
  triggerClassName,
  selectedCountLabel = 'выбрано',
  searchable,
  searchPlaceholder,
  noResultsText,
}: MultiSelectInternalProps<T>): ReactNode => {
  const triggerId = useId()
  const listboxId = useId()

  const triggerLabel = useMemo(() => {
    if (value.length === 0) return null
    if (value.length <= 2) {
      const optionsMap = new Map(
        options.map((o) => [o.value, o.label]),
      )
      return value
        .map((v) => optionsMap.get(v))
        .filter(Boolean)
        .join(', ')
    }
    return `${value.length} ${selectedCountLabel}`
  }, [value, options, selectedCountLabel])

  const handleToggle = useCallback(
    (optionValue: T): void => {
      const next = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
      onChange(next)
    },
    [value, onChange],
  )

  const isSelected = useCallback((v: T) => value.includes(v), [value])

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={triggerId} className={styles.label}>
          {label}
        </label>
      )}
      <Popover.Root>
        <Popover.Trigger
          id={triggerId}
          className={triggerClassName}
          disabled={disabled}
          aria-haspopup='listbox'
          aria-expanded={undefined}
          aria-controls={listboxId}
        >
          <span
            className={triggerLabel ? undefined : styles.placeholder}
          >
            {triggerLabel ?? placeholder}
          </span>
          <span className={styles.icon}>
            <ChevronDown />
          </span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={styles.content}
            style={{ width: 'var(--radix-popover-trigger-width)' }}
            sideOffset={4}
            align='start'
            onOpenAutoFocus={(e) => {
              if (!searchable) {
                e.preventDefault()
                const listbox = document.getElementById(listboxId)
                listbox?.focus()
              }
            }}
          >
            <SelectContent
              options={options}
              isSelected={isSelected}
              onSelect={handleToggle}
              listboxId={listboxId}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              noResultsText={noResultsText}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const Select = <T extends string = string>(
  props: SelectProps<T>,
): ReactNode => {
  const { fluid, size = 'm' } = props

  const wrapperClassName = getUIClasses(
    styles.wrapper,
    { fluid },
    commonStyles,
  )
  const triggerClassName = getUIClasses(
    styles.trigger,
    { size, fluid },
    commonStyles,
  )

  if (props.multiple) {
    return (
      <MultiSelect
        {...props}
        wrapperClassName={wrapperClassName}
        triggerClassName={triggerClassName}
      />
    )
  }

  return (
    <SingleSelect
      {...props}
      wrapperClassName={wrapperClassName}
      triggerClassName={triggerClassName}
    />
  )
}

export default Select
