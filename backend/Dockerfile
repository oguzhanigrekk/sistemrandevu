FROM golang:1.24-alpine AS builder

WORKDIR /app

# Sisteme git ve ufak build gereksinimlerini kur (opsiyonel ama sağlıklı)
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Static olarak derleme
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest
WORKDIR /root/
# SSL sertifikaları için
RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /app/main .

EXPOSE 3000

CMD ["./main"]
