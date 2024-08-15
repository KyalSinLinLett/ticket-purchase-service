import { TicketService } from 'services/ticket'
import { TicketRepository } from 'services/ticket/ticket.repository'
import { FindOptions, Op } from 'sequelize'
import { TicketDetails } from 'types/models/ticket'
import { Ticket } from 'db/init'

describe('TicketService unit tests', () => {
  let ticketService: TicketService
  let ticketRepositoryMock: jest.Mocked<TicketRepository>

  const mockTicketData = {
    id: '1',
    event_id: 'event1',
    user_id: 'user1',
    ticket_category_id: 'category1',
    price: 100,
    purchased_at: new Date('2024-12-31'),
  }

  beforeEach(() => {
    ticketRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TicketRepository>

    ticketService = new TicketService(ticketRepositoryMock)
  })

  it('should create a ticket', async () => {
    ticketRepositoryMock.create.mockResolvedValue(mockTicketData as any)

    const result = await ticketService.createTicket(mockTicketData)

    expect(ticketRepositoryMock.create).toHaveBeenCalledWith(mockTicketData)
    expect(result).toEqual(mockTicketData)
  })

  it('should get a ticket by ID', async () => {
    const id = '1'
    ticketRepositoryMock.findById.mockResolvedValue(mockTicketData as any)

    const result = await ticketService.getTicketById(id)

    expect(ticketRepositoryMock.findById).toHaveBeenCalledWith(id)
    expect(result).toEqual(mockTicketData)
  })

  it('should get a ticket by conditions', async () => {
    const condition: FindOptions<TicketDetails> = {
      where: { event_id: 'event1' },
    }
    ticketRepositoryMock.findOne.mockResolvedValue(mockTicketData as any)

    const result = await ticketService.getTicket(condition)

    expect(ticketRepositoryMock.findOne).toHaveBeenCalledWith(condition)
    expect(result).toEqual(mockTicketData)
  })

  it('should get all tickets with a filter', async () => {
    const tickets: TicketDetails[] = [mockTicketData as any]
    ticketRepositoryMock.findAll.mockResolvedValue(tickets as any)

    const filter: FindOptions<TicketDetails> = { where: { price: 100 } }
    const result = await ticketService.getAllTickets(filter)

    expect(ticketRepositoryMock.findAll).toHaveBeenCalledWith(filter)
    expect(result).toEqual(tickets)
  })

  it('should update a ticket', async () => {
    const id = '1'
    const updateData: Partial<TicketDetails> = {
      price: 120,
    }
    const updatedTicket = { ...mockTicketData, ...updateData } as TicketDetails

    ticketRepositoryMock.findById.mockResolvedValue(mockTicketData as any)
    ticketRepositoryMock.update.mockResolvedValue(updatedTicket as any)

    const result = await ticketService.updateTicket(id, updateData as any)

    expect(ticketRepositoryMock.update).toHaveBeenCalledWith(id, updateData)
    expect(result).toEqual(updatedTicket)
  })

  it('should delete a ticket', async () => {
    const id = '1'

    ticketRepositoryMock.findById.mockResolvedValue(mockTicketData as any)
    ticketRepositoryMock.delete.mockResolvedValue(mockTicketData as any)

    const result = await ticketService.deleteTicket(id)

    expect(ticketRepositoryMock.delete).toHaveBeenCalledWith(id)
    expect(result).toEqual(mockTicketData)
  })

  it('should handle create ticket failure', async () => {
    ticketRepositoryMock.create.mockRejectedValue(new Error('Creation failed'))

    await expect(ticketService.createTicket(mockTicketData)).rejects.toThrow(
      'Creation failed',
    )
  })

  it('should handle find ticket failure', async () => {
    const condition: FindOptions<TicketDetails> = {
      where: { event_id: 'nonexistent' },
    }
    ticketRepositoryMock.findOne.mockRejectedValue(new Error('Find failed'))

    await expect(ticketService.getTicket(condition)).rejects.toThrow(
      'Find failed',
    )
  })

  it('should handle get ticket by ID failure', async () => {
    const id = 'nonexistent-id'
    ticketRepositoryMock.findById.mockResolvedValue(null)

    const result = await ticketService.getTicketById(id)

    expect(ticketRepositoryMock.findById).toHaveBeenCalledWith(id)
    expect(result).toBeNull()
  })

  it('should handle get all tickets failure', async () => {
    ticketRepositoryMock.findAll.mockRejectedValue(new Error('Get all failed'))

    await expect(ticketService.getAllTickets({})).rejects.toThrow(
      'Get all failed',
    )
  })

  it('should handle update ticket failure', async () => {
    const id = '1'
    const updateData: Partial<TicketDetails> = {
      price: 150,
    }
    ticketRepositoryMock.findById.mockResolvedValue(mockTicketData as any)
    ticketRepositoryMock.update.mockRejectedValue(new Error('Update failed'))

    await expect(
      ticketService.updateTicket(id, updateData as any),
    ).rejects.toThrow('Update failed')
  })

  it('should handle delete ticket failure', async () => {
    const id = '1'
    ticketRepositoryMock.findById.mockResolvedValue(mockTicketData as any)
    ticketRepositoryMock.delete.mockRejectedValue(new Error('Delete failed'))

    await expect(ticketService.deleteTicket(id)).rejects.toThrow(
      'Delete failed',
    )
  })

  it('should return null when no ticket is found with the given condition', async () => {
    const condition: FindOptions<TicketDetails> = {
      where: { event_id: 'nonexistent' },
    }
    ticketRepositoryMock.findOne.mockResolvedValue(null)

    const result = await ticketService.getTicket(condition)

    expect(ticketRepositoryMock.findOne).toHaveBeenCalledWith(condition)
    expect(result).toBeNull()
  })

  it('should return an empty array when no tickets are found', async () => {
    ticketRepositoryMock.findAll.mockResolvedValue([])

    const result = await ticketService.getAllTickets({})

    expect(ticketRepositoryMock.findAll).toHaveBeenCalledWith({})
    expect(result).toEqual([])
  })

  it('should create a ticket with minimal data', async () => {
    const minimalTicketData: Partial<TicketDetails> = {
      id: '2',
      event_id: 'event2',
      user_id: 'user2',
      ticket_category_id: 'category2',
      price: 80,
      purchased_at: new Date('2024-11-01'),
    }
    ticketRepositoryMock.create.mockResolvedValue(minimalTicketData as any)

    const result = await ticketService.createTicket(
      minimalTicketData as TicketDetails,
    )

    expect(ticketRepositoryMock.create).toHaveBeenCalledWith(minimalTicketData)
    expect(result).toEqual(minimalTicketData)
  })

  it('should handle create ticket with extra fields', async () => {
    const extraFieldsData: any = {
      ...mockTicketData,
      extra_field: 'extra_value',
    }
    ticketRepositoryMock.create.mockResolvedValue(extraFieldsData)

    const result = await ticketService.createTicket(
      extraFieldsData as TicketDetails,
    )

    expect(ticketRepositoryMock.create).toHaveBeenCalledWith(extraFieldsData)
    expect(result).toEqual(extraFieldsData)
  })

  it('should correctly handle empty ticket data', async () => {
    const emptyData = {
      id: '',
      event_id: '',
      user_id: '',
      ticket_category_id: '',
      price: 0,
      purchased_at: new Date(0),
    }
    ticketRepositoryMock.create.mockResolvedValue(emptyData as any)

    const result = await ticketService.createTicket(emptyData)

    expect(ticketRepositoryMock.create).toHaveBeenCalledWith(emptyData)
    expect(result).toEqual(emptyData)
  })

  it('should handle ticket creation with incomplete data', async () => {
    const incompleteData: Partial<TicketDetails> = {
      event_id: 'event3',
      user_id: 'user3',
      price: 90,
      // Missing id, ticket_category_id, and purchased_at
    }
    ticketRepositoryMock.create.mockRejectedValue(
      new Error('Invalid ticket data'),
    )

    await expect(
      ticketService.createTicket(incompleteData as TicketDetails),
    ).rejects.toThrow('Invalid ticket data')
  })

  it('should handle get ticket by ID with non-existent ID', async () => {
    const id = 'nonexistent-id'
    ticketRepositoryMock.findById.mockResolvedValue(null)

    const result = await ticketService.getTicketById(id)

    expect(ticketRepositoryMock.findById).toHaveBeenCalledWith(id)
    expect(result).toBeNull()
  })

  it('should handle update ticket with non-existent ID', async () => {
    const id = 'nonexistent-id'
    const updateData: Partial<TicketDetails> = {
      price: 130,
    }
    ticketRepositoryMock.findById.mockResolvedValue(null)

    const result = await ticketService.updateTicket(id, updateData as any)

    expect(ticketRepositoryMock.update).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle delete ticket with non-existent ID', async () => {
    const id = 'nonexistent-id'
    ticketRepositoryMock.findById.mockResolvedValue(null)

    const result = await ticketService.deleteTicket(id)

    expect(ticketRepositoryMock.delete).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should handle update ticket with non-existent data', async () => {
    const id = '1'
    const updateData: Partial<TicketDetails> = {
      price: 140,
    }
    ticketRepositoryMock.findById.mockResolvedValue(null)

    const result = await ticketService.updateTicket(id, updateData as any)

    expect(ticketRepositoryMock.update).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should correctly handle the creation of a ticket with a future purchase date', async () => {
    const futureTicketData: TicketDetails = {
      id: '3',
      event_id: 'event4',
      user_id: 'user4',
      ticket_category_id: 'category4',
      price: 200,
      purchased_at: new Date('2025-01-01'),
    }
    ticketRepositoryMock.create.mockResolvedValue(futureTicketData as any)

    const result = await ticketService.createTicket(futureTicketData)

    expect(ticketRepositoryMock.create).toHaveBeenCalledWith(futureTicketData)
    expect(result).toEqual(futureTicketData)
  })

  it('should handle finding a ticket with empty filters', async () => {
    const emptyFilter: FindOptions<TicketDetails> = {}
    ticketRepositoryMock.findOne.mockResolvedValue(null)

    const result = await ticketService.getTicket(emptyFilter)

    expect(ticketRepositoryMock.findOne).toHaveBeenCalledWith(emptyFilter)
    expect(result).toBeNull()
  })

  it('should handle finding tickets with multiple filters', async () => {
    const filter: FindOptions<TicketDetails> = {
      where: { price: { [Op.gt]: 50 } },
    }
    const tickets: TicketDetails[] = [mockTicketData]
    ticketRepositoryMock.findAll.mockResolvedValue(tickets as any)

    const result = await ticketService.getAllTickets(filter)

    expect(ticketRepositoryMock.findAll).toHaveBeenCalledWith(filter)
    expect(result).toEqual(tickets)
  })
})
