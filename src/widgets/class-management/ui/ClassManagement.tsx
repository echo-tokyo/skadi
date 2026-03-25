import { Input, PlugDefault, Sentinel, Text } from '@/shared/ui'
import { useMemo, useState } from 'react'
import { CreateClassButton } from '@/features/create-class'
import { useInfiniteClasses } from '../model/use-infinite-classes'
import { useInfiniteScroll } from '@/shared/lib'
import { ClassCardItem } from './ClassCardItem'
import styles from './styles.module.scss'

const CLASSES_PARAMS = { perPage: 5 }

const { actions, classes } = styles

const ClassManagement = () => {
  const [classSearchValue, setClassSearchValue] = useState<string>('')
  const {
    classes: classItems,
    hasMore,
    isFetchingNextPage,
    loadMore,
  } = useInfiniteClasses(CLASSES_PARAMS)

  const filteredClasses = useMemo(() => {
    const searchValue = classSearchValue.toLowerCase()
    return classItems.filter((el) => {
      const matchesFullname = el.name.toLowerCase().includes(searchValue)
      return matchesFullname
    })
  }, [classItems, classSearchValue])

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isFetchingNextPage,
    loadMore,
  })

  return (
    <>
      <Text weight='bold' size='20'>
        Управление группами
      </Text>
      <div className={actions}>
        <Input
          fluid
          title='Найти группу'
          onChange={setClassSearchValue}
          value={classSearchValue}
        />
        <CreateClassButton />
      </div>

      <div className={classes}>
        {filteredClasses.length > 0 ? (
          filteredClasses.map((classElem) => (
            <ClassCardItem classData={classElem} key={classElem.id} />
          ))
        ) : (
          <PlugDefault />
        )}
        <Sentinel ref={sentinelRef} />
      </div>
    </>
  )
}

export default ClassManagement
