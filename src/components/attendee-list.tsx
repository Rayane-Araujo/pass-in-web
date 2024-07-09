import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime  from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: string
    name: string 
    email: string
    createdAt: string
    checkedInAt: string | null 
} 


export function AttendeeList() {
    const [search, setSearch ] = useState('')
    const [page, setPage] = useState(1)

    const [total, setTotal] = useState(0)
    const [attendees, setAttendees] = useState<Attendee[]>([])

    const totalPages = Math.ceil(total / 10)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

        url.searchParams.set('pageIndex', String(page - 1))

        if(search.length > 0){
          url.searchParams.set('query', search)
        }

        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setAttendees(data.attendees)
            setTotal(data.total)
        })
    }, [page, search])

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value)
        setPage(1)
    }

    function goToNextPage() {
        setPage(page + 1)
    }

    function goToPreviousPage() {
        setPage(page - 1)
    }

    function goToFirstPage() {
        setPage(1)
    }

    function goToLastPage() {
        setPage(totalPages)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center">
                <h1 className='text-2xl font-bold'>Participantes</h1>
                <div className="px-3 py-1.5 w-72 border border-white/10 bg-transparent rounded-lg text-sm flex items-center gap-3">
                    <Search className='size-4' />
                    <input onChange={onSearchInputChanged} 
                    className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" placeholder="Buscar participantes..." />
                </div>
            
            </div>
            <Table>
                <thead>
                    <tr className='border-b border-white/10'>
                        <TableHeader style={{ width: 64 }}>
                            <input className='size-4 bg-black/20 rounded border-white/10' type="checkbox" />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} className='py-3 px-2.5 font-text-left'></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id}>
                                <TableCell>
                                    <input className='size-4 bg-black/20 rounded border-white/10' type="checkbox" />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>
                                    {attendee.checkedInAt === null 
                                    ? <span className='text-zinc-500'>Não fez check-in</span>
                                    : dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className='size-4' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                           Mostrando {attendees.length} de {total} itens
                        </TableCell>

                        <td className='py-3 px-2.5  text-zinc-300 text-right' colSpan={3}>

                            <div className='inline-flex items-center gap-8'>
                                <span>Página {page} de { totalPages }</span>
                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} className='bg-white/20 border border-white/10 rounded-md p-1.5' disabled={page === 1}>
                                        <ChevronsLeft className='size-4' />
                                    </IconButton>

                                    <IconButton onClick={goToPreviousPage} className='bg-white/20 border border-white/10 rounded-md p-1.5'  disabled={page === 1}>
                                        <ChevronLeft className='size-4' />
                                    </IconButton>

                                    <IconButton onClick={goToNextPage} className='bg-white/20 border border-white/10 rounded-md p-1.5'  disabled={page === totalPages}>
                                        <ChevronRight className='size-4' />
                                    </IconButton>

                                    <IconButton onClick={goToLastPage} className='bg-white/20 border border-white/10 rounded-md p-1.5' disabled={page === totalPages}>
                                        <ChevronsRight className='size-4' />
                                    </IconButton>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}