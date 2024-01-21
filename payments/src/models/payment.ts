import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      require: true,
      type: String,
    },
    stripeId: {
      require: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
  }
);

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  });
};

PaymentSchema.set("versionKey", "version");
PaymentSchema.plugin(updateIfCurrentPlugin);

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "payment",
  PaymentSchema
);

export { Payment };
