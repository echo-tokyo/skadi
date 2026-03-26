// TODO: порефакторить этот нейрокал
/* eslint-disable */

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
import styles from './styles.module.scss'
import commonStyles from '../styles/common.module.scss'
import { getUIClasses } from '@/shared/lib/classNames/getUIClasses'
import ChevronIcon from '../icons/ChevronIcon'
import Check from '../icons/CheckIcon'

export interface SelectOption<T extends string = string> {
  label: string
  value: T
  disabled?: boolean
}

interface BaseProps<T extends string = string> {
  options: SelectOption<T>[]
  placeholder?: string
  label?: string
  description?: string
  disabled?: boolean
  fluid?: boolean
  size?: 's' | 'm'
  selectedCountLabel?: string
  required?: boolean
  isValid?: boolean
  /** Включить поиск по опциям */
  searchable?: boolean
  /** Placeholder для поля поиска */
  searchPlaceholder?: string
  /** Текст когда ничего не найдено */
  noResultsText?: string
  /**
   * Callback для серверного поиска. Вызывается с дебаунсом (300ms).
   * Когда передан — клиентская фильтрация отключается.
   */
  onSearchChange?: (query: string) => void
  /** Callback для загрузки следующей страницы */
  onLoadMore?: () => void
  /** Есть ли ещё страницы для загрузки */
  hasMore?: boolean
  /** Идёт ли загрузка следующей страницы */
  isLoadingMore?: boolean
}

interface SingleProps<T extends string = string> extends BaseProps<T> {
  multiple?: false
  value: T | ''
  onChange: (value: T | '') => void
}

interface MultipleProps<T extends string = string> extends BaseProps<T> {
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
      <span className={styles.check_indicator}>{selected && <Check />}</span>
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
          const nextPos = Math.min(currentPos + 1, enabledIndices.length - 1)
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
            setHighlightedIndex(enabledIndices[enabledIndices.length - 1])
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
    [options, highlightedIndex, setHighlightedIndex, onSelect, onClose],
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
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
}

const SEARCH_DEBOUNCE_MS = 300

const SelectContent = <T extends string>({
  options,
  isSelected,
  onSelect,
  listboxId,
  searchable,
  searchPlaceholder = 'Поиск...',
  noResultsText = 'Ничего не найдено',
  onSearchChange,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: SelectContentProps<T>): ReactNode => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Серверный поиск: дебаунс перед вызовом колбэка
  useEffect(() => {
    if (!onSearchChange) return
    const timer = setTimeout(() => onSearchChange(searchQuery), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchQuery, onSearchChange])

  // Фиксируем выбранные значения при открытии — чтобы элементы не прыгали
  // сразу при выборе, а поднимались вверх только при следующем открытии
  const initialSelectedRef = useRef<Set<string>>(
    new Set(options.filter((o) => isSelected(o.value)).map((o) => o.value)),
  )

  // Клиентская фильтрация — только когда нет серверного поиска
  const filteredOptions = useMemo(() => {
    const base = (() => {
      if (onSearchChange) return options
      if (!searchQuery.trim()) return options
      const query = searchQuery.toLowerCase()
      return options.filter((o) => o.label.toLowerCase().includes(query))
    })()
    return [...base].sort((a, b) => {
      const aSelected = initialSelectedRef.current.has(a.value) ? 0 : 1
      const bSelected = initialSelectedRef.current.has(b.value) ? 0 : 1
      return aSelected - bSelected
    })
  }, [options, searchQuery, onSearchChange])

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
      setSearchQuery(e.target.value)
    },
    [],
  )

  const { handleKeyDown } = useSelectKeyboard({
    options: filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    onSelect: (value) => onSelect(value as T),
    onClose: () => {},
  })

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
      {onLoadMore && hasMore && (
        <div className={styles.load_more_wrapper}>
          <button
            className={styles.load_more}
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SingleSelect
// ---------------------------------------------------------------------------

interface SingleSelectInternalProps<T extends string> extends SingleProps<T> {
  wrapperClassName: string
  triggerClassName: string
}

const SingleSelect = <T extends string>({
  options,
  label,
  description,
  placeholder,
  disabled,
  required,
  isValid = true,
  value,
  onChange,
  wrapperClassName,
  triggerClassName,
  searchable,
  searchPlaceholder,
  noResultsText,
  onSearchChange,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: SingleSelectInternalProps<T>): ReactNode => {
  const [open, setOpen] = useState(false)
  const triggerId = useId()
  const labelId = `${triggerId}-label`
  const listboxId = useId()
  const descriptionId = `${triggerId}-description`

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label,
    [options, value],
  )

  const handleSelect = useCallback(
    (optionValue: T): void => {
      onChange(value === optionValue ? '' : optionValue)
      setOpen(false)
    },
    [value, onChange],
  )

  const isSelected = useCallback((v: T) => v === value, [value])

  return (
    <div className={wrapperClassName}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-label='обязательное поле'>
              *
            </span>
          )}
        </span>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          id={triggerId}
          className={triggerClassName}
          disabled={disabled}
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={!isValid}
          aria-describedby={description ? descriptionId : undefined}
          aria-required={required}
        >
          <span className={selectedLabel ? undefined : styles.placeholder}>
            {selectedLabel ?? placeholder}
          </span>
          <span className={styles.icon}>
            <ChevronIcon />
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
              onSelect={handleSelect}
              listboxId={listboxId}
              searchable={searchable}
              searchPlaceholder={searchPlaceholder}
              noResultsText={noResultsText}
              onSearchChange={onSearchChange}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MultiSelect
// ---------------------------------------------------------------------------

interface MultiSelectInternalProps<T extends string> extends MultipleProps<T> {
  wrapperClassName: string
  triggerClassName: string
}

const MultiSelect = <T extends string>({
  options,
  label,
  description,
  placeholder,
  disabled,
  required,
  isValid = true,
  value,
  onChange,
  wrapperClassName,
  triggerClassName,
  selectedCountLabel = 'выбрано',
  searchable,
  searchPlaceholder,
  noResultsText,
  onSearchChange,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MultiSelectInternalProps<T>): ReactNode => {
  const triggerId = useId()
  const labelId = `${triggerId}-label`
  const listboxId = useId()
  const descriptionId = `${triggerId}-description`

  const triggerLabel = useMemo(() => {
    if (value.length === 0) {
      return null
    }
    if (value.length <= 2) {
      const optionsMap = new Map(options.map((o) => [o.value, o.label]))
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
        <span id={labelId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-label='обязательное поле'>
              *
            </span>
          )}
        </span>
      )}
      <Popover.Root>
        <Popover.Trigger
          id={triggerId}
          className={triggerClassName}
          disabled={disabled}
          aria-haspopup='listbox'
          aria-expanded={undefined}
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={!isValid}
          aria-describedby={description ? descriptionId : undefined}
          aria-required={required}
        >
          <span className={triggerLabel ? undefined : styles.placeholder}>
            {triggerLabel ?? placeholder}
          </span>
          <span className={styles.icon}>
            <ChevronIcon />
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
              onSearchChange={onSearchChange}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              isLoadingMore={isLoadingMore}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const Select = <T extends string = string>(
  props: SelectProps<T>,
): ReactNode => {
  const { fluid, size = 'm', isValid = true } = props

  const wrapperClassName = getUIClasses(
    styles.wrapper,
    { fluid, additionalClasses: isValid ? [] : [commonStyles.invalidText] },
    commonStyles,
  )
  const triggerClassName = getUIClasses(
    styles.trigger,
    { size, fluid, additionalClasses: isValid ? [] : [commonStyles.invalid] },
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
