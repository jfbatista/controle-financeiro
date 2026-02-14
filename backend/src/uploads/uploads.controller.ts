import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Param,
    ParseIntPipe,
    UseGuards,
    Request,
    Get,
    Res,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller('uploads')
export class UploadsController {
    constructor(private prisma: PrismaService) { }

    @Post('transaction/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadTransactionAttachment(
        @Request() req,
        @Param('id', ParseIntPipe) transactionId: number,
        @UploadedFile() file: any,
    ) {
        if (!file) {
            throw new NotFoundException('No file uploaded');
        }

        // Verify transaction ownership
        const transaction = await this.prisma.transaction.findFirst({
            where: { id: transactionId, companyId: req.user.companyId },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        const attachment = await this.prisma.attachment.create({
            data: {
                filename: file.originalname,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                transactionId: transactionId,
            },
        });

        return attachment;
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getFile(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Res() res: any,
    ) {
        const attachment = await this.prisma.attachment.findUnique({
            where: { id },
            include: { transaction: true },
        });

        if (!attachment) {
            throw new NotFoundException('Attachment not found');
        }

        console.log(attachment.transaction.companyId);
        console.log(req.user.companyId);

        if (attachment.transaction.companyId !== req.user.companyId) {
            throw new ForbiddenException('Access denied');
        }

        const file = createReadStream(join(process.cwd(), attachment.path));
        res.set({
            'Content-Type': attachment.mimetype,
            'Content-Disposition': `inline; filename="${attachment.filename}"`,
        });
        file.pipe(res);
    }
}
