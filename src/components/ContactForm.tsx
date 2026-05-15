import { useRef, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CheckCircle, LoaderCircle, Send, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ACCEPTED_UPLOAD_EXTENSIONS,
  ACCEPTED_UPLOAD_TYPES,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  enquiryClientSchema,
  isSubmissionPayload,
  projectTypes,
  type EnquiryFormValues,
  type SubmissionPayload,
} from "@/lib/enquiry";

interface UploadedFile {
  file: File;
  preview: string | null;
}

const ENQUIRY_ENDPOINT =
  import.meta.env.VITE_ENQUIRY_ENDPOINT?.trim() || "/.netlify/functions/send-enquiry";

const parseSubmissionResponse = async (response: Response): Promise<SubmissionPayload> => {
  const responseText = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!responseText.trim()) {
    if (response.ok) {
      return { ok: true, uploadedFiles: [] };
    }

    if (response.status === 404) {
      return {
        ok: false,
        error: "The enquiry endpoint is not available in the current environment.",
      };
    }

    return {
      ok: false,
      error: "The enquiry request failed without a response body.",
    };
  }

  if (contentType.includes("application/json")) {
    try {
      const parsed: unknown = JSON.parse(responseText);
      if (isSubmissionPayload(parsed)) {
        return parsed;
      }
      return {
        ok: false,
        error: "The enquiry endpoint returned an unexpected response shape.",
      };
    } catch {
      return {
        ok: false,
        error: "The enquiry endpoint returned invalid JSON.",
      };
    }
  }

  if (!response.ok && response.status === 404) {
    return {
      ok: false,
      error: "The enquiry endpoint is not available in the current environment.",
    };
  }

  return response.ok
    ? { ok: true, uploadedFiles: [] }
    : { ok: false, error: responseText };
};

const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [siteVisitDate, setSiteVisitDate] = useState<Date | undefined>();
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryClientSchema),
    defaultValues: { name: "", email: "", phone: "", projectType: "", message: "" },
  });

  const clearUploadedFiles = () => {
    setUploadedFiles((currentFiles) => {
      currentFiles.forEach((uploadedFile) => {
        if (uploadedFile.preview) {
          URL.revokeObjectURL(uploadedFile.preview);
        }
      });
      return [];
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setSubmitError(null);
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!ACCEPTED_UPLOAD_TYPES.includes(file.type as (typeof ACCEPTED_UPLOAD_TYPES)[number])) {
        setFileError("Only JPG, PNG, WebP, and PDF files are accepted.");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError("Each file must be under 10MB.");
        continue;
      }
      if (uploadedFiles.length + newFiles.length >= MAX_FILE_COUNT) {
        setFileError(`Maximum ${MAX_FILE_COUNT} files allowed.`);
        break;
      }
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      newFiles.push({ file, preview });
    }
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const removed = prev[index];
      if (removed.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
    setFileError(null);
  };

  const onSubmit = async (data: EnquiryFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitWarning(null);

    try {
      const formData = new FormData();
      formData.set("name", data.name);
      formData.set("email", data.email);
      formData.set("phone", data.phone);
      formData.set("projectType", data.projectType);
      formData.set("message", data.message);

      if (siteVisitDate) {
        formData.set("siteVisitDate", siteVisitDate.toISOString());
      }

      uploadedFiles.forEach(({ file }) => {
        formData.append("files", file);
      });

      const response = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const payload = await parseSubmissionResponse(response);

      if (!payload.ok) {
        const errorMsg = "error" in payload ? payload.error : "Unable to send your enquiry right now.";
        throw new Error(errorMsg);
      }
      if (!response.ok) {
        throw new Error("Unable to send your enquiry right now.");
      }

      form.reset();
      setSiteVisitDate(undefined);
      clearUploadedFiles();
      setSubmitted(true);
      setSubmitWarning(payload.warning ?? null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to send your enquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  return (
    <section id="enquiry" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
              Enquire Now
            </span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Request a Free Quote
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell us about your project and we'll get back to you within 24 hours with a tailored quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="text-center py-16 px-6 border border-border rounded-sm bg-card">
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Thank You!
              </h3>
              <p className="text-muted-foreground">
                Your enquiry has been received. We'll be in touch within 24 hours.
              </p>
              {submitWarning && (
                <p className="text-sm text-muted-foreground mt-4">
                  {submitWarning}
                </p>
              )}
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 border border-border rounded-sm p-8 bg-card">
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com.au" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="04XX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-display">Project Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select a project type</option>
                            {projectTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Site Visit Calendar Scheduler */}
                <div>
                  <label className="text-sm font-medium text-foreground font-display block mb-2">
                    Schedule a Site Visit <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !siteVisitDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {siteVisitDate ? format(siteVisitDate, "PPP") : "Select a preferred date for site visit"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={siteVisitDate}
                        onSelect={setSiteVisitDate}
                        disabled={disabledDays}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Available in Greater Sydney, Melbourne & Brisbane metro areas. Monday–Saturday.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-display">Project Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project, location, and any specific requirements..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload for Vision Boards / Blueprints */}
                <div>
                  <label className="text-sm font-medium text-foreground font-display block mb-2">
                    Upload Plans or Vision Boards <span className="text-muted-foreground font-normal">(optional, max 5 files)</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload blueprints, sketches, or vision boards
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP, PDF — up to 10MB each
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={ACCEPTED_UPLOAD_EXTENSIONS.join(",")}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  {fileError && (
                    <p className="text-sm text-destructive mt-2">{fileError}</p>
                  )}
                  {submitError && (
                    <p className="text-sm text-destructive mt-2">{submitError}</p>
                  )}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {uploadedFiles.map((uf, index) => (
                        <div key={index} className="relative group border border-border rounded-md overflow-hidden bg-muted">
                          {uf.preview ? (
                            <img src={uf.preview} alt={uf.file.name} className="w-full h-24 object-cover" />
                          ) : (
                            <div className="w-full h-24 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground px-2 text-center truncate">
                                {uf.file.name}
                              </span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-secondary/80 text-secondary-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-gold text-secondary font-display font-semibold tracking-wide uppercase h-12"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Sending Enquiry...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Enquiry
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
