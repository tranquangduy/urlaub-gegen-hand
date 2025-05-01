export interface BookingRequest {
  id: string;
  listingId: string;
  helperId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  specialRequirements?: string;
  status: import('@/types').BookingStatus;
  createdAt: string;
  updatedAt: string;
  checkInAt?: string;
  checkOutAt?: string;
}

const BOOKING_REQUESTS_KEY = 'bookingRequests';

export function getBookingRequests(): BookingRequest[] {
  const raw = localStorage.getItem(BOOKING_REQUESTS_KEY);
  try {
    return raw ? (JSON.parse(raw) as BookingRequest[]) : [];
  } catch {
    console.warn('Failed to parse booking requests from storage');
    return [];
  }
}

export function saveBookingRequest(request: BookingRequest): void {
  const requests = getBookingRequests();
  requests.push(request);
  localStorage.setItem(BOOKING_REQUESTS_KEY, JSON.stringify(requests));
}

/**
 * Update an existing booking request by ID and return the updated request.
 */
export function updateBookingRequest(
  id: string,
  updates: Partial<BookingRequest>
): BookingRequest | undefined {
  const requests = getBookingRequests();
  let updatedRequest: BookingRequest | undefined;
  const newRequests = requests.map((req) => {
    if (req.id === id) {
      updatedRequest = {
        ...req,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updatedRequest;
    }
    return req;
  });
  if (updatedRequest) {
    localStorage.setItem(BOOKING_REQUESTS_KEY, JSON.stringify(newRequests));
  }
  return updatedRequest;
}
