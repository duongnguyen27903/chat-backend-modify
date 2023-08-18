import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateChatDto {
    @ApiProperty()
    id: string
    @ApiProperty()
    sender: string
    @IsNotEmpty()
    @ApiProperty()
    content: string
    @ApiProperty()
    tags: string[]
    @ApiProperty()
    send_at: Date
}
